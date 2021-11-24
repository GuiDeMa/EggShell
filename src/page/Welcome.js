import React from "react";
import { Button, Grid, Hidden, useMediaQuery, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import Mask from "../resources/Mask";
import Banner from "../resources/Banner.png";
import config from "../config.json";

export default function Welcome() {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >
      <div>
        <div
          style={{
            backgroundColor: theme.palette.primary.main,
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            backgroundImage: `url(${Banner})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover"
          }}
        >
          <div
            style={{
              height: "100%"
            }}
          >
            <div style={{ padding: "24px" }}></div>
            <div style={{ display: "flex", height: "100%" }}>
              <div style={{ flexGrow: 1 }} />
              <div
                style={{
                  marginTop: "calc((100vh/2) - 309px",
                  textAlign: "center",
                  backgroundColor: "rgb(177, 124, 1, 0.15)",
                  backdropFilter: "blur(5px)",
                  padding: "12px",
                  borderRadius: "24px",
                  maxWidth: "333px",
                  maxHeight: "420px"
                }}
              >
                <h1 style={{ color: "#000000" }}>{config.appIdentity.title}</h1>
                <p>{config.appIdentity.description}</p>
                <Grid
                  container
                  spacing={2}
                  style={{ justifyContent: "center" }}
                >
                  <Grid item>
                    <Button
                      style={{ width: 222 }}
                      variant="contained"
                      color="secondary"
                    >
                      <Link
                        to="/auth"
                        style={{
                          color: "#000000",
                          textDecoration: "none",
                          textTransform: "none"
                        }}
                      >
                        Sign In
                      </Link>
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      href="https://relayx.com/market/PXL"
                      target="_blank"
                      style={{
                        width: 222,
                        textTransform: "none",
                        color: "black"
                      }}
                      variant="outlined"
                      color="secondary"
                    >
                      {config.welcome.buttonText}
                    </Button>
                  </Grid>
                </Grid>
              </div>
              <div style={{ flexGrow: 1 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
