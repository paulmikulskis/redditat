import styles from "../styles/Home.module.css";
import Switch from "@mui/material/Switch";
import { FileGrid } from "../components/FileGrid";

export default function Home() {
  return (
    <div className={styles.container}>
      <div>
        <span>With default Theme:</span>
      </div>
      <FileGrid folder="dyana/postem" />
    </div>
  );
}
