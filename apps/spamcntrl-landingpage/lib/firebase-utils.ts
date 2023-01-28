import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { CLScan } from "../models/CLScan";
import { CLMyStats } from "../models/CLMyStats";
import { CLVideo } from "../models/CLVideo";
import { createFirebase, IFirebase } from "./firebase";
import { IContactUsFormData } from "../pages/contact";

export async function getStats(
  firebase: IFirebase | null,
  email: string
): Promise<CLMyStats> {
  return new Promise(async (resolve, reject) => {
    if (firebase) {
      const db = getFirestore(firebase.firebaseApp);
      const q = query(collection(db, "scans"));
      const snapshots = await getDocs(q);

      const stats = new CLMyStats();
      snapshots.forEach((doc) => {
        const obj = new CLScan(doc.data());

        if (email == obj.email) {
          obj.videos.forEach((video) => {
            stats.addVideoStats(new CLVideo(video));
          });
        }
      });

      if (stats.totalComments == 0) {
        reject(null);
      } else {
        resolve(stats);
      }
    }
  });
}

export async function sendContactUsForm(
  firebase: IFirebase | null,
  contactUsFormData: IContactUsFormData
) {
  return new Promise(async (resolve, reject) => {
    if (firebase) {
      const db = getFirestore(firebase.firebaseApp);
      try {
        const ref = await addDoc(collection(db, "contact_us_form"), contactUsFormData);
        resolve(ref);
      } catch (err) {
        reject(null);
      }
    }
  });
}
