import BarLoader from "react-spinners/BarLoader";
import { CSSProperties } from "react";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "black",
};

function LoadingNewJob() {
  return (
    <div>
      <BarLoader loading height={10} width={500} cssOverride={override} />
      <div className="loader"> Creating New Job...</div>
    </div>
  );
}

export default LoadingNewJob;
