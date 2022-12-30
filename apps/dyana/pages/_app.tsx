import React from "react";
import PropTypes from "prop-types";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { ThemeProvider, CssBaseline } from "@mui/material";

import createEmotionCache from "../utils/createEmotionCache";
import { theme } from "../utils/theme";
import "../styles/globals.css";

const clientSideEmotionCache = createEmotionCache();

const MyApp = (props: {
  Component: any;
  emotionCache?: EmotionCache | undefined;
  pageProps: any;
}) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
};

export default MyApp;

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
