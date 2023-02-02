import { useContext, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { AppContext } from "../context";
import {
  getMyVideosSearchResults,
  setMyVideosSearchResults,
} from "../store/slices/myVideosSlice";
import { lastNVideos } from "../utils/api";

interface IUseGetAllVideos {
  deps?: React.DependencyList | undefined;
  cond?: boolean | null | undefined;
  abortController?: AbortController;
}

function useGetAllVideos(options?: IUseGetAllVideos) {
  const { user } = useContext(AppContext);
  const dispatch = useDispatch();

  const cond = options ? options.cond : undefined;
  const deps = options ? options.deps : undefined;
  let abortController = options ? options.abortController : undefined;

  const hasDeps = deps && deps.length > 0;

  const myVideosSearchResults = getMyVideosSearchResults();

  const timeoutRef = useRef<NodeJS.Timeout>();
  useEffect(() => {
    if (!abortController) {
      abortController = new AbortController();
    }

    async function doFetch() {
      if (
        (cond === null || cond === undefined || cond) &&
        myVideosSearchResults == undefined &&
        user &&
        user.id
      ) {
        try {
          await lastNVideos(user.id, 1000000000, {
            signal: abortController ? abortController.signal : null,
          }).then((videos) => {
            if (videos) {
              dispatch(setMyVideosSearchResults(videos));
            }
          });
        } catch (error) {
        } finally {
        }
      }
    }

    if (hasDeps) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(doFetch, 1000);
    } else {
      doFetch();
    }

    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, deps);
}

export default useGetAllVideos;
