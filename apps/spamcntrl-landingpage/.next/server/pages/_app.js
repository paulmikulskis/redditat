/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./contexts/AuthContext.tsx":
/*!**********************************!*\
  !*** ./contexts/AuthContext.tsx ***!
  \**********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"AuthProvider\": () => (/* binding */ AuthProvider),\n/* harmony export */   \"useAuth\": () => (/* binding */ useAuth)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var firebase_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase/auth */ \"firebase/auth\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _lib_firebase__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/firebase */ \"./lib/firebase.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([firebase_auth__WEBPACK_IMPORTED_MODULE_1__, _lib_firebase__WEBPACK_IMPORTED_MODULE_3__]);\n([firebase_auth__WEBPACK_IMPORTED_MODULE_1__, _lib_firebase__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n// Inside AuthProvider\nconst provider = new firebase_auth__WEBPACK_IMPORTED_MODULE_1__.GoogleAuthProvider();\nconst authContextDefaultValues = {\n    user: null,\n    login: ()=>{},\n    logout: ()=>{},\n    firebase: null\n};\nconst AuthContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_2__.createContext)(authContextDefaultValues);\nfunction useAuth() {\n    return (0,react__WEBPACK_IMPORTED_MODULE_2__.useContext)(AuthContext);\n}\nfunction AuthProvider({ children  }) {\n    const [user, setUser] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(null);\n    const [firebase, setFirebase] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(null);\n    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(()=>{\n        const firebase = (0,_lib_firebase__WEBPACK_IMPORTED_MODULE_3__.createFirebase)();\n        setFirebase(firebase);\n        if (firebase) {\n            (0,firebase_auth__WEBPACK_IMPORTED_MODULE_1__.onAuthStateChanged)(firebase.auth, (user)=>{\n                setUser(user);\n            });\n        }\n    }, []);\n    const login = ()=>{\n        if (firebase) {\n            (0,firebase_auth__WEBPACK_IMPORTED_MODULE_1__.signInWithPopup)(firebase.auth, provider).then((result)=>{\n                // This gives you a Google Access Token. You can use it to access the Google API.\n                const credential = firebase_auth__WEBPACK_IMPORTED_MODULE_1__.GoogleAuthProvider.credentialFromResult(result);\n                const token = credential === null || credential === void 0 ? void 0 : credential.accessToken;\n                // The signed-in user info.\n                const user = result.user;\n                setUser(user);\n            }).catch((error)=>{\n                // Handle Errors here.\n                const errorCode = error.code;\n                const errorMessage = error.message;\n                // The email of the user's account used.\n                const email = error.email;\n                // The AuthCredential type that was used.\n                const credential = firebase_auth__WEBPACK_IMPORTED_MODULE_1__.GoogleAuthProvider.credentialFromError(error);\n                setUser(null);\n            });\n        }\n    };\n    const logout = ()=>{\n        if (firebase) {\n            firebase.auth.signOut();\n        }\n    };\n    const value = {\n        user,\n        login,\n        logout,\n        firebase\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AuthContext.Provider, {\n            value: value,\n            children: children\n        }, void 0, false, {\n            fileName: \"/Users/paulmikulskis/Development/redditat/apps/spamcntrl-landingpage/contexts/AuthContext.tsx\",\n            lineNumber: 96,\n            columnNumber: 7\n        }, this)\n    }, void 0, false);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb250ZXh0cy9BdXRoQ29udGV4dC50c3guanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUtzQjtBQU9SO0FBQzZDO0FBRTNELHNCQUFzQjtBQUN0QixNQUFNUSxXQUFXLElBQUlSLDZEQUFrQkE7QUFTdkMsTUFBTVMsMkJBQTRDO0lBQ2hEQyxNQUFNLElBQUk7SUFDVkMsT0FBTyxJQUFNLENBQUM7SUFDZEMsUUFBUSxJQUFNLENBQUM7SUFDZkMsVUFBVSxJQUFJO0FBQ2hCO0FBRUEsTUFBTUMsNEJBQWNYLG9EQUFhQSxDQUFrQk07QUFDNUMsU0FBU00sVUFBVTtJQUN4QixPQUFPWCxpREFBVUEsQ0FBQ1U7QUFDcEIsQ0FBQztBQU1NLFNBQVNFLGFBQWEsRUFBRUMsU0FBUSxFQUFTLEVBQUU7SUFDaEQsTUFBTSxDQUFDUCxNQUFNUSxRQUFRLEdBQUdiLCtDQUFRQSxDQUFjLElBQUk7SUFDbEQsTUFBTSxDQUFDUSxVQUFVTSxZQUFZLEdBQUdkLCtDQUFRQSxDQUFtQixJQUFJO0lBRS9EQyxnREFBU0EsQ0FBQyxJQUFNO1FBQ2QsTUFBTU8sV0FBV04sNkRBQWNBO1FBQy9CWSxZQUFZTjtRQUVaLElBQUlBLFVBQVU7WUFDWlosaUVBQWtCQSxDQUFDWSxTQUFTTyxJQUFJLEVBQUUsQ0FBQ1YsT0FBUztnQkFDMUNRLFFBQVFSO1lBQ1Y7UUFDRixDQUFDO0lBQ0gsR0FBRyxFQUFFO0lBRUwsTUFBTUMsUUFBUSxJQUFNO1FBQ2xCLElBQUlFLFVBQVU7WUFDWlgsOERBQWVBLENBQUNXLFNBQVNPLElBQUksRUFBRVosVUFDNUJhLElBQUksQ0FBQyxDQUFDQyxTQUFXO2dCQUNoQixpRkFBaUY7Z0JBQ2pGLE1BQU1DLGFBQWF2QixrRkFBdUMsQ0FBQ3NCO2dCQUMzRCxNQUFNRyxRQUFRRix1QkFBQUEsd0JBQUFBLEtBQUFBLElBQUFBLFdBQVlHLFdBQVc7Z0JBQ3JDLDJCQUEyQjtnQkFDM0IsTUFBTWhCLE9BQU9ZLE9BQU9aLElBQUk7Z0JBQ3hCUSxRQUFRUjtZQUNWLEdBQ0NpQixLQUFLLENBQUMsQ0FBQ0MsUUFBVTtnQkFDaEIsc0JBQXNCO2dCQUN0QixNQUFNQyxZQUFZRCxNQUFNRSxJQUFJO2dCQUM1QixNQUFNQyxlQUFlSCxNQUFNSSxPQUFPO2dCQUNsQyx3Q0FBd0M7Z0JBQ3hDLE1BQU1DLFFBQVFMLE1BQU1LLEtBQUs7Z0JBQ3pCLHlDQUF5QztnQkFDekMsTUFBTVYsYUFBYXZCLGlGQUFzQyxDQUFDNEI7Z0JBQzFEVixRQUFRLElBQUk7WUFDZDtRQUNKLENBQUM7SUFDSDtJQUVBLE1BQU1OLFNBQVMsSUFBTTtRQUNuQixJQUFJQyxVQUFVO1lBQ1pBLFNBQVNPLElBQUksQ0FBQ2UsT0FBTztRQUN2QixDQUFDO0lBQ0g7SUFFQSxNQUFNQyxRQUFRO1FBQ1oxQjtRQUNBQztRQUNBQztRQUNBQztJQUNGO0lBRUEscUJBQ0U7a0JBQ0UsNEVBQUNDLFlBQVl1QixRQUFRO1lBQUNELE9BQU9BO3NCQUFRbkI7Ozs7Ozs7QUFHM0MsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3UydWJlc3BhbXB1cmdlLXdlYnNpdGUvLi9jb250ZXh0cy9BdXRoQ29udGV4dC50c3g/NmQ4MSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBHb29nbGVBdXRoUHJvdmlkZXIsXG4gIG9uQXV0aFN0YXRlQ2hhbmdlZCxcbiAgc2lnbkluV2l0aFBvcHVwLFxuICBVc2VyLFxufSBmcm9tICdmaXJlYmFzZS9hdXRoJ1xuaW1wb3J0IHtcbiAgY3JlYXRlQ29udGV4dCxcbiAgdXNlQ29udGV4dCxcbiAgUmVhY3ROb2RlLFxuICB1c2VTdGF0ZSxcbiAgdXNlRWZmZWN0LFxufSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IGNyZWF0ZUZpcmViYXNlLCBJRmlyZWJhc2UgfSBmcm9tICcuLi9saWIvZmlyZWJhc2UnXG5cbi8vIEluc2lkZSBBdXRoUHJvdmlkZXJcbmNvbnN0IHByb3ZpZGVyID0gbmV3IEdvb2dsZUF1dGhQcm92aWRlcigpXG5cbnR5cGUgYXV0aENvbnRleHRUeXBlID0ge1xuICB1c2VyOiBVc2VyIHwgbnVsbFxuICBsb2dpbjogKCkgPT4gdm9pZFxuICBsb2dvdXQ6ICgpID0+IHZvaWRcbiAgZmlyZWJhc2U6IElGaXJlYmFzZSB8IG51bGxcbn1cblxuY29uc3QgYXV0aENvbnRleHREZWZhdWx0VmFsdWVzOiBhdXRoQ29udGV4dFR5cGUgPSB7XG4gIHVzZXI6IG51bGwsXG4gIGxvZ2luOiAoKSA9PiB7fSxcbiAgbG9nb3V0OiAoKSA9PiB7fSxcbiAgZmlyZWJhc2U6IG51bGwsXG59XG5cbmNvbnN0IEF1dGhDb250ZXh0ID0gY3JlYXRlQ29udGV4dDxhdXRoQ29udGV4dFR5cGU+KGF1dGhDb250ZXh0RGVmYXVsdFZhbHVlcylcbmV4cG9ydCBmdW5jdGlvbiB1c2VBdXRoKCkge1xuICByZXR1cm4gdXNlQ29udGV4dChBdXRoQ29udGV4dClcbn1cblxudHlwZSBQcm9wcyA9IHtcbiAgY2hpbGRyZW46IFJlYWN0Tm9kZVxufVxuXG5leHBvcnQgZnVuY3Rpb24gQXV0aFByb3ZpZGVyKHsgY2hpbGRyZW4gfTogUHJvcHMpIHtcbiAgY29uc3QgW3VzZXIsIHNldFVzZXJdID0gdXNlU3RhdGU8VXNlciB8IG51bGw+KG51bGwpXG4gIGNvbnN0IFtmaXJlYmFzZSwgc2V0RmlyZWJhc2VdID0gdXNlU3RhdGU8SUZpcmViYXNlIHwgbnVsbD4obnVsbClcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IGZpcmViYXNlID0gY3JlYXRlRmlyZWJhc2UoKVxuICAgIHNldEZpcmViYXNlKGZpcmViYXNlKVxuXG4gICAgaWYgKGZpcmViYXNlKSB7XG4gICAgICBvbkF1dGhTdGF0ZUNoYW5nZWQoZmlyZWJhc2UuYXV0aCwgKHVzZXIpID0+IHtcbiAgICAgICAgc2V0VXNlcih1c2VyKVxuICAgICAgfSlcbiAgICB9XG4gIH0sIFtdKVxuXG4gIGNvbnN0IGxvZ2luID0gKCkgPT4ge1xuICAgIGlmIChmaXJlYmFzZSkge1xuICAgICAgc2lnbkluV2l0aFBvcHVwKGZpcmViYXNlLmF1dGgsIHByb3ZpZGVyKVxuICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgLy8gVGhpcyBnaXZlcyB5b3UgYSBHb29nbGUgQWNjZXNzIFRva2VuLiBZb3UgY2FuIHVzZSBpdCB0byBhY2Nlc3MgdGhlIEdvb2dsZSBBUEkuXG4gICAgICAgICAgY29uc3QgY3JlZGVudGlhbCA9IEdvb2dsZUF1dGhQcm92aWRlci5jcmVkZW50aWFsRnJvbVJlc3VsdChyZXN1bHQpXG4gICAgICAgICAgY29uc3QgdG9rZW4gPSBjcmVkZW50aWFsPy5hY2Nlc3NUb2tlblxuICAgICAgICAgIC8vIFRoZSBzaWduZWQtaW4gdXNlciBpbmZvLlxuICAgICAgICAgIGNvbnN0IHVzZXIgPSByZXN1bHQudXNlclxuICAgICAgICAgIHNldFVzZXIodXNlcilcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgIC8vIEhhbmRsZSBFcnJvcnMgaGVyZS5cbiAgICAgICAgICBjb25zdCBlcnJvckNvZGUgPSBlcnJvci5jb2RlXG4gICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gZXJyb3IubWVzc2FnZVxuICAgICAgICAgIC8vIFRoZSBlbWFpbCBvZiB0aGUgdXNlcidzIGFjY291bnQgdXNlZC5cbiAgICAgICAgICBjb25zdCBlbWFpbCA9IGVycm9yLmVtYWlsXG4gICAgICAgICAgLy8gVGhlIEF1dGhDcmVkZW50aWFsIHR5cGUgdGhhdCB3YXMgdXNlZC5cbiAgICAgICAgICBjb25zdCBjcmVkZW50aWFsID0gR29vZ2xlQXV0aFByb3ZpZGVyLmNyZWRlbnRpYWxGcm9tRXJyb3IoZXJyb3IpXG4gICAgICAgICAgc2V0VXNlcihudWxsKVxuICAgICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGxvZ291dCA9ICgpID0+IHtcbiAgICBpZiAoZmlyZWJhc2UpIHtcbiAgICAgIGZpcmViYXNlLmF1dGguc2lnbk91dCgpXG4gICAgfVxuICB9XG5cbiAgY29uc3QgdmFsdWUgPSB7XG4gICAgdXNlcixcbiAgICBsb2dpbixcbiAgICBsb2dvdXQsXG4gICAgZmlyZWJhc2UsXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8QXV0aENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfT57Y2hpbGRyZW59PC9BdXRoQ29udGV4dC5Qcm92aWRlcj5cbiAgICA8Lz5cbiAgKVxufVxuIl0sIm5hbWVzIjpbIkdvb2dsZUF1dGhQcm92aWRlciIsIm9uQXV0aFN0YXRlQ2hhbmdlZCIsInNpZ25JbldpdGhQb3B1cCIsImNyZWF0ZUNvbnRleHQiLCJ1c2VDb250ZXh0IiwidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJjcmVhdGVGaXJlYmFzZSIsInByb3ZpZGVyIiwiYXV0aENvbnRleHREZWZhdWx0VmFsdWVzIiwidXNlciIsImxvZ2luIiwibG9nb3V0IiwiZmlyZWJhc2UiLCJBdXRoQ29udGV4dCIsInVzZUF1dGgiLCJBdXRoUHJvdmlkZXIiLCJjaGlsZHJlbiIsInNldFVzZXIiLCJzZXRGaXJlYmFzZSIsImF1dGgiLCJ0aGVuIiwicmVzdWx0IiwiY3JlZGVudGlhbCIsImNyZWRlbnRpYWxGcm9tUmVzdWx0IiwidG9rZW4iLCJhY2Nlc3NUb2tlbiIsImNhdGNoIiwiZXJyb3IiLCJlcnJvckNvZGUiLCJjb2RlIiwiZXJyb3JNZXNzYWdlIiwibWVzc2FnZSIsImVtYWlsIiwiY3JlZGVudGlhbEZyb21FcnJvciIsInNpZ25PdXQiLCJ2YWx1ZSIsIlByb3ZpZGVyIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./contexts/AuthContext.tsx\n");

/***/ }),

/***/ "./lib/firebase.ts":
/*!*************************!*\
  !*** ./lib/firebase.ts ***!
  \*************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"createFirebase\": () => (/* binding */ createFirebase)\n/* harmony export */ });\n/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase/app */ \"firebase/app\");\n/* harmony import */ var firebase_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase/auth */ \"firebase/auth\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([firebase_app__WEBPACK_IMPORTED_MODULE_0__, firebase_auth__WEBPACK_IMPORTED_MODULE_1__]);\n([firebase_app__WEBPACK_IMPORTED_MODULE_0__, firebase_auth__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\nconst createFirebase = ()=>{\n    const firebaseConfig = {\n        apiKey: \"AIzaSyCTCVlg5VbobNhZR2pDOcDUwiJJBTEUWEw\",\n        authDomain: \"yungsten-f1a69.firebaseapp.com\",\n        projectId: \"yungsten-f1a69\",\n        storageBucket: \"yungsten-f1a69.appspot.com\",\n        messagingSenderId: \"999495820871\",\n        appId: \"1:999495820871:web:f12ae921844d6462e4f362\",\n        measurementId: \"G-EN9M1LVP7Z\"\n    };\n    if (!(0,firebase_app__WEBPACK_IMPORTED_MODULE_0__.getApps)().length) {\n        (0,firebase_app__WEBPACK_IMPORTED_MODULE_0__.initializeApp)(firebaseConfig);\n    }\n    return {\n        auth: (0,firebase_auth__WEBPACK_IMPORTED_MODULE_1__.getAuth)(),\n        firebaseApp: (0,firebase_app__WEBPACK_IMPORTED_MODULE_0__.getApp)()\n    };\n};\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9saWIvZmlyZWJhc2UudHMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQTJFO0FBQzdCO0FBT3ZDLE1BQU1JLGlCQUFpQixJQUFpQjtJQUM3QyxNQUFNQyxpQkFBaUI7UUFDckJDLFFBQVFDLHlDQUFpRDtRQUN6REcsWUFBWUgsZ0NBQXFEO1FBQ2pFSyxXQUFXTCxnQkFBb0Q7UUFDL0RPLGVBQWVQLDRCQUF3RDtRQUN2RVMsbUJBQW1CVCxjQUE2RDtRQUNoRlcsT0FBT1gsMkNBQWdEO1FBQ3ZEYSxlQUFlYixjQUF3RDtJQUN6RTtJQUVBLElBQUksQ0FBQ04scURBQU9BLEdBQUdxQixNQUFNLEVBQUU7UUFDckJ0QiwyREFBYUEsQ0FBQ0s7SUFDaEIsQ0FBQztJQUVELE9BQU87UUFDTGtCLE1BQU1wQixzREFBT0E7UUFDYnFCLGFBQWF0QixvREFBTUE7SUFDckI7QUFDRixFQUFFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdTJ1YmVzcGFtcHVyZ2Utd2Vic2l0ZS8uL2xpYi9maXJlYmFzZS50cz81ZDIxIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGluaXRpYWxpemVBcHAsIGdldEFwcHMsIGdldEFwcCwgRmlyZWJhc2VBcHAgfSBmcm9tIFwiZmlyZWJhc2UvYXBwXCI7XG5pbXBvcnQgeyBBdXRoLCBnZXRBdXRoIH0gZnJvbSBcImZpcmViYXNlL2F1dGhcIjtcblxuZXhwb3J0IGludGVyZmFjZSBJRmlyZWJhc2Uge1xuICBhdXRoOiBBdXRoO1xuICBmaXJlYmFzZUFwcDogRmlyZWJhc2VBcHA7XG59XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVGaXJlYmFzZSA9ICgpOiBJRmlyZWJhc2UgPT4ge1xuICBjb25zdCBmaXJlYmFzZUNvbmZpZyA9IHtcbiAgICBhcGlLZXk6IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NQQU1QQUdFX0ZJUkVCQVNFX0FQSV9LRVksXG4gICAgYXV0aERvbWFpbjogcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfU1BBTVBBR0VfRklSRUJBU0VfQVVUSF9ET01BSU4sXG4gICAgcHJvamVjdElkOiBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TUEFNUEFHRV9GSVJFQkFTRV9QUk9KRUNUX0lELFxuICAgIHN0b3JhZ2VCdWNrZXQ6IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NQQU1QQUdFX0ZJUkVCQVNFX1NUT1JBR0VfQlVDS0VULFxuICAgIG1lc3NhZ2luZ1NlbmRlcklkOiBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TUEFNUEFHRV9GSVJFQkFTRV9NRVNTQUdJTkdfU0VOREVSX0lELFxuICAgIGFwcElkOiBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TUEFNUEFHRV9GSVJFQkFTRV9BUFBfSUQsXG4gICAgbWVhc3VyZW1lbnRJZDogcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfU1BBTVBBR0VfRklSRUJBU0VfTUVBU1VSRU1FTlRfSUQsXG4gIH07XG5cbiAgaWYgKCFnZXRBcHBzKCkubGVuZ3RoKSB7XG4gICAgaW5pdGlhbGl6ZUFwcChmaXJlYmFzZUNvbmZpZyk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGF1dGg6IGdldEF1dGgoKSxcbiAgICBmaXJlYmFzZUFwcDogZ2V0QXBwKCksXG4gIH07XG59O1xuIl0sIm5hbWVzIjpbImluaXRpYWxpemVBcHAiLCJnZXRBcHBzIiwiZ2V0QXBwIiwiZ2V0QXV0aCIsImNyZWF0ZUZpcmViYXNlIiwiZmlyZWJhc2VDb25maWciLCJhcGlLZXkiLCJwcm9jZXNzIiwiZW52IiwiTkVYVF9QVUJMSUNfU1BBTVBBR0VfRklSRUJBU0VfQVBJX0tFWSIsImF1dGhEb21haW4iLCJORVhUX1BVQkxJQ19TUEFNUEFHRV9GSVJFQkFTRV9BVVRIX0RPTUFJTiIsInByb2plY3RJZCIsIk5FWFRfUFVCTElDX1NQQU1QQUdFX0ZJUkVCQVNFX1BST0pFQ1RfSUQiLCJzdG9yYWdlQnVja2V0IiwiTkVYVF9QVUJMSUNfU1BBTVBBR0VfRklSRUJBU0VfU1RPUkFHRV9CVUNLRVQiLCJtZXNzYWdpbmdTZW5kZXJJZCIsIk5FWFRfUFVCTElDX1NQQU1QQUdFX0ZJUkVCQVNFX01FU1NBR0lOR19TRU5ERVJfSUQiLCJhcHBJZCIsIk5FWFRfUFVCTElDX1NQQU1QQUdFX0ZJUkVCQVNFX0FQUF9JRCIsIm1lYXN1cmVtZW50SWQiLCJORVhUX1BVQkxJQ19TUEFNUEFHRV9GSVJFQkFTRV9NRUFTVVJFTUVOVF9JRCIsImxlbmd0aCIsImF1dGgiLCJmaXJlYmFzZUFwcCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./lib/firebase.ts\n");

/***/ }),

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _contexts_AuthContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../contexts/AuthContext */ \"./contexts/AuthContext.tsx\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_contexts_AuthContext__WEBPACK_IMPORTED_MODULE_2__]);\n_contexts_AuthContext__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\nfunction App({ Component , pageProps  }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_contexts_AuthContext__WEBPACK_IMPORTED_MODULE_2__.AuthProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"/Users/paulmikulskis/Development/redditat/apps/spamcntrl-landingpage/pages/_app.tsx\",\n            lineNumber: 8,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/paulmikulskis/Development/redditat/apps/spamcntrl-landingpage/pages/_app.tsx\",\n        lineNumber: 7,\n        columnNumber: 5\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTtBQUE4QjtBQUV3QjtBQUV2QyxTQUFTQyxJQUFJLEVBQUVDLFVBQVMsRUFBRUMsVUFBUyxFQUFZLEVBQUU7SUFDOUQscUJBQ0UsOERBQUNILCtEQUFZQTtrQkFDWCw0RUFBQ0U7WUFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7OztBQUc5QixDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdTJ1YmVzcGFtcHVyZ2Utd2Vic2l0ZS8uL3BhZ2VzL19hcHAudHN4PzJmYmUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuLi9zdHlsZXMvZ2xvYmFscy5jc3MnXG5pbXBvcnQgdHlwZSB7IEFwcFByb3BzIH0gZnJvbSAnbmV4dC9hcHAnXG5pbXBvcnQgeyBBdXRoUHJvdmlkZXIgfSBmcm9tICcuLi9jb250ZXh0cy9BdXRoQ29udGV4dCdcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfTogQXBwUHJvcHMpIHtcbiAgcmV0dXJuIChcbiAgICA8QXV0aFByb3ZpZGVyPlxuICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxuICAgIDwvQXV0aFByb3ZpZGVyPlxuICApXG59XG4iXSwibmFtZXMiOlsiQXV0aFByb3ZpZGVyIiwiQXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "firebase/app":
/*!*******************************!*\
  !*** external "firebase/app" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = import("firebase/app");;

/***/ }),

/***/ "firebase/auth":
/*!********************************!*\
  !*** external "firebase/auth" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = import("firebase/auth");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.tsx"));
module.exports = __webpack_exports__;

})();