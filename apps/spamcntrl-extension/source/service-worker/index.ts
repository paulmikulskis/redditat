const GOOGLE_CLIENT_ID =
  '999495820871-aienn9fgfrs3mhl1uh9geef9i7t72msb.apps.googleusercontent.com'

import 'emoji-log'
import { browser } from 'webextension-polyfill-ts'

import { initializeApp } from 'firebase/app'
import {
  signInWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth'
import { IRuntimeResponse, TCommand } from '../models'
import {
  addDoc,
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore'
import ILog from '../models/ILog'
import moment from 'moment'

function firebaseInit() {
  const firebaseConfig = {
    apiKey: 'AIzaSyCTCVlg5VbobNhZR2pDOcDUwiJJBTEUWEw',
    authDomain: 'yungsten-f1a69.firebaseapp.com',
    projectId: 'yungsten-f1a69',
    storageBucket: 'yungsten-f1a69.appspot.com',
    messagingSenderId: '999495820871',
    appId: '1:999495820871:web:f12ae921844d6462e4f362',
    measurementId: 'G-EN9M1LVP7Z',
  }

  const app = initializeApp(firebaseConfig)
  return app
}

browser.runtime.onMessage.addListener((msg): Promise<IRuntimeResponse> => {
  return new Promise(async (resolve) => {
    const command: TCommand = msg.command
    const data: any = msg.data

    const app = firebaseInit()
    const auth = getAuth(app)
    const database = getFirestore(app)

    async function getUser(userId: string) {
      return getDocs(
        query(collection(database, 'users'), where('id', '==', userId))
      )
    }

    async function getLogs(userId: string) {
      const userDocs = await getUser(userId)

      let logs: any = []
      if (userDocs.size > 0) {
        const logsDocs = await getDocs(
          query(
            collection(database, 'logs'),
            where(documentId(), '==', userDocs.docs[0].id)
          )
        )

        logsDocs.forEach((logDoc) => {
          const data = logDoc.data()
          const keys = Object.keys(data)
          if (keys && keys.length > 0) {
            keys.forEach((key) => {
              const split = key.split('-')
              const id = split[0]
              const date = split[1]

              const _logs = data[key].map((d: string) => {
                const _d = JSON.parse(d)

                return {
                  ..._d,
                  date: moment(date, 'MM/DD/YY@HH:mm:ss').format('X'),
                  key,
                  id,
                }
              }) as ILog[]
              logs.push(..._logs)
            })
          }
        })
      }

      return logs
    }

    switch (command) {
      case 'login':
        signInWithEmailAndPassword(auth, data.email, data.password).catch(
          function (error) {
            resolve({ type: command, status: 'error', message: error })
          }
        )

        onAuthStateChanged(auth, function (user) {
          if (user) {
            resolve({ type: command, status: 'success', message: user })
          } else {
          }
        })
        break
      case 'signup':
        signInWithEmailAndPassword(auth, data.email, data.password).catch(
          function (error) {
            if (error.code == 'auth/user-not-found') {
              createUserWithEmailAndPassword(auth, data.email, data.password)
                .then((userCredential) => {
                  sendEmailVerification(userCredential.user)
                })
                .catch((error) => {
                  resolve({ type: command, status: 'error', message: error })
                })
            } else {
              resolve({ type: command, status: 'error', message: error })
            }
          }
        )

        auth.onAuthStateChanged(function (user) {
          if (user) {
            resolve({ type: command, status: 'success', message: user })
          } else {
          }
        })
        break
      case 'auth':
        if (auth.currentUser) {
          auth.currentUser
            .reload()
            .then(async () => {
              const user = auth.currentUser
              if (user) {
                resolve({ type: command, status: 'success', message: user })
              } else {
                resolve({ type: command, status: 'error', message: false })
              }
            })
            .catch(async () => {
              resolve({ type: command, status: 'error', message: false })
            })
        } else {
          auth.onAuthStateChanged(async function (user) {
            if (user) {
              resolve({ type: command, status: 'success', message: user })
            } else {
              resolve({ type: command, status: 'error', message: false })
            }
          })
        }
        break
      case 'logout':
        auth.signOut().then(
          async function () {
            try {
              await browser.identity.launchWebAuthFlow({
                url: 'https://accounts.google.com/logout',
              })
            } catch (err) {}
            resolve({ type: command, status: 'success', message: true })
          },
          function (error) {
            resolve({ type: command, status: 'error', message: error })
          }
        )
        break
      case 'resetPassword':
        sendPasswordResetEmail(auth, data.email)
          .then(() => {
            resolve({
              type: command,
              status: 'success',
              message: null,
            })
          })
          .catch((error) => {
            resolve({
              type: command,
              status: 'error',
              message: error,
            })
          })
        break
      case 'login_google':
        const googleScopes = ['openid', 'email', 'profile']
        const googleRedirectUrl = browser.identity.getRedirectURL()
        const googleUrl =
          'https://accounts.google.com/o/oauth2/auth?' +
          new URLSearchParams({
            client_id: GOOGLE_CLIENT_ID,
            redirect_uri: googleRedirectUrl,
            response_type: 'token',
            scope: googleScopes.join(' '),
          }).toString()

        let options = {
          interactive: true,
          url: googleUrl,
        }

        browser.identity
          .launchWebAuthFlow(options)
          .then((responseUri) => {
            if (browser.runtime.lastError) {
              resolve({
                type: command,
                status: 'error',
                message: browser.runtime.lastError,
              })
            }

            if (responseUri) {
              const url = new URL(responseUri)
              const urlParams = new URLSearchParams(url.hash.slice(1))
              const params = Object.fromEntries(urlParams.entries()) // access_token, expires_in
              const token = params.access_token

              let credential = GoogleAuthProvider.credential(null, token)

              signInWithCredential(auth, credential)
                .then(() => {
                  const user = auth.currentUser
                  resolve({ type: command, status: 'success', message: user })
                })
                .catch((error) => {
                  resolve({ type: command, status: 'error', message: error })
                })
            }
          })
          .catch((error) => {
            resolve({ type: command, status: 'error', message: error })
          })

        break
      case 'getUserFirebase':
        getUser(data)
          .then((doc) => {
            resolve({
              type: command,
              status: 'success',
              message: doc.size > 0 ? doc.docs[0].data() : null,
            })
          })
          .catch((error) => {
            resolve({ type: command, status: 'error', message: error })
          })
        break

      case 'stripeCustomersAddPaymentMethod':
        addDoc(
          collection(
            doc(database, 'stripe_customers', data.userId),
            'payment_methods'
          ),
          { id: data.paymentMethodId }
        )
          .then((doc) => {
            resolve({ type: command, status: 'success', message: doc })
          })
          .catch((error) => {
            resolve({ type: command, status: 'error', message: error })
          })
        break
      case 'getStripeCustomer':
        getDoc(doc(database, 'stripe_customers', data))
          .then((doc) => {
            resolve({ type: command, status: 'success', message: doc.data() })
          })
          .catch((error) => {
            resolve({ type: command, status: 'error', message: error })
          })
        break
      case 'getPaymentMethod':
        getDocs(
          collection(doc(database, 'stripe_customers', data), 'payment_methods')
        )
          .then((q) => {
            const data: any = []
            if (q) {
              q.forEach((doc) => {
                data.push(doc.data())
              })
            }
            resolve({ type: command, status: 'success', message: data })
          })
          .catch((error) => {
            resolve({ type: command, status: 'error', message: error })
          })
        break
      case 'createPayment':
        addDoc(
          collection(
            doc(database, 'stripe_customers', data.userId),
            'payments'
          ),
          data.paymentData
        )
          .then((doc) => {
            resolve({ type: command, status: 'success', message: doc })
          })
          .catch((error) => {
            resolve({ type: command, status: 'error', message: error })
          })
        break

      case 'getLogs':
        getLogs(data.userId)
          .then((logs) => {
            resolve({ type: command, status: 'success', message: logs })
          })
          .catch((error) => {
            console.log('log: getLogs', error)
            resolve({ type: command, status: 'error', message: error })
          })
        break
    }
  })
})
