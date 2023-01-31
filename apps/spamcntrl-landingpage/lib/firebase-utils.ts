import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { CLScan } from "../models/CLScan";
import { CLMyStats } from "../models/CLMyStats";
import { CLVideo } from "../models/CLVideo";
import { IFirebase } from "./firebase";

export async function getStats(
  firebase: IFirebase | null,
  email: string
): Promise<CLMyStats> {
  return new Promise(async (resolve, reject) => {
    if (firebase) {
      const db = getFirestore(firebase.firebaseApp);
      const q = query(
        collection(db, "scans"),
        where("datetime_genisis.email", "==", email)
      );
      const snapshots = await getDocs(q);

      const stats = new CLMyStats();
      snapshots.forEach((doc) => {
        const obj = new CLScan(doc.data());

        obj.videos.forEach((video) => {
          stats.addVideoStats(new CLVideo(video));
        });
      });

      if (stats.totalComments == 0) {
        reject(null);
      } else {
        resolve(stats);
      }
    }
  });
}
