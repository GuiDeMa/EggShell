import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Drawer,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Snackbar,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useTheme,
  Paper
} from "@mui/material";
import { digestMessage } from "../api/TwetchActions";
import { BSVABI } from "../utils/BSVABI";
import { Link, useHistory, useLocation } from "react-router-dom";
import { twquery, FetchPostDetail } from "../api/TwetchGraph";
import Quote from "./Quote";
import config from "../config.json";

const Twetch = require("@twetch/sdk");

export default function Composer(props) {
  const window = props.window;
  const location = useLocation();
  const branchTx = location.search.split("=")[1];
  const history = useHistory();
  const theme = useTheme();
  const container =
    window !== undefined ? () => window().document.body : undefined;
  const ticker = config.customization.ticker;
  const replyTx = location.pathname.split("/")[2];
  const [type, setType] = useState("default");
  const [quote, setQuote] = useState({});
  const [placeholder, setPlaceholder] = useState("What's the latest?");
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);
  const [estimate, setEstimate] = useState(
    parseFloat(config.customization.postPrice)
  );
  const twetch = new Twetch({
    clientIdentifier: config.ownerInfo.clientIdentifier
  });
  const Helpers = twetch.Helpers;
  const exchangeRate = twetch.Helpers.exchangeRate.price;
  const dolAmount = config.customization.postPrice;
  const bitAmount = parseFloat(dolAmount / exchangeRate).toFixed(8);

  useEffect(() => {
    const pKey = twetch.crypto.privFromMnemonic(localStorage.mnemonic);
    twetch.wallet.restore(pKey);
    if (replyTx) {
      twquery(`{
        allPosts(
          condition: {transaction: "${replyTx}"}
        ) {
          edges {
            node {
              userByUserId {
                name
              }
            }
          }
        }
      }`).then((res) =>
        setPlaceholder(
          `In reply to ${res.allPosts.edges[0].node.userByUserId.name}`
        )
      );
    }
    if (branchTx) {
      FetchPostDetail(branchTx).then((res) => {
        setQuote(res.allPosts.edges[0]);
        setEstimate(estimate + 0.01);
      });
    }
  }, [replyTx, branchTx]);

  /* useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (content.length > 0) {
        if (branchTx) {
          do something
        }
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [content]); */

  const handleChangeContent = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (localStorage.tokenTwetchAuth === "anon") {
      alert("Please, Log In");
      return;
    }
    if (localStorage.isOneClick === "false") {
      setOpen(true);
    } else {
      twetchPost(content, replyTx)
        .then((res) => {
          //console.log(res);
          setContent("");
          if (replyTx) {
            history.push(`/t/${replyTx}`);
          } else {
            history.push("/");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const getColor = () => {
    //console.log(256 - content.length);
    if (content.length >= 250) {
      return "#E81212";
    } else {
      if (251 - content.length < 21) {
        return "#085AF6";
      } else {
        return "#696969";
      }
    }
  };
  const handleDrawerToggle = (e) => {
    e.stopPropagation();
    setOpen(!open);
  };

  const handle1Click = (e) => {
    e.stopPropagation();
    twetchPost(content, replyTx)
      .then((res) => {
        //console.log(res)
        setOpen(false);
        setContent("");
        if (replyTx) {
          history.push(`/t/${replyTx}`);
        } else {
          history.push("/");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const pay = (
    <main>
      <div
        style={{
          height: "100%",
          width: "100vw",
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          bottom: 0
        }}
      >
        <div
          style={{
            display: "flex",
            position: "fixed",
            bottom: 0,
            width: "100%"
          }}
        >
          <div style={{ flexGrow: 1 }}></div>
          <Paper
            style={{
              width: "600px",
              maxWidth: "calc(100% - 24px)",
              borderRadius: "6px 6px 0 0"
            }}
          >
            <Paper elevation={3} style={{ padding: "16px", display: "flex" }}>
              <Typography
                style={{
                  margin: 0,
                  fontWeight: "bold",
                  fontSize: "22px",
                  textDecoration: "none"
                }}
              >
                Twetch
                <span
                  style={{
                    color: theme.palette.primary.main,
                    fontSize: "16px"
                  }}
                >
                  Pay
                </span>
              </Typography>
              <div style={{ flexGrow: 1 }} />
              <p
                style={{
                  fontSize: "18px",
                  lineHeight: "21px",
                  color: "#bdbdbd",
                  margin: 0,
                  fontWeight: "normal",
                  cursor: "pointer"
                }}
                onClick={handleDrawerToggle}
              >
                Close
              </p>
            </Paper>
            <div
              id="detail"
              style={{
                padding: "16px",
                borderTop: `2px solid ${theme.palette.divider}`
              }}
            >
              <div
                style={{
                  margin: "0 0 26px 0",
                  borderRadius: "6px"
                }}
              >
                <Paper
                  elevation={12}
                  style={{
                    display: "block",
                    margin: "21px",
                    padding: "21px",
                    borderRadius: "6px",
                    textDecoration: "none"
                  }}
                >
                  <Link
                    style={{
                      display: "inline-block",
                      position: "relative",
                      marginRight: "12px",
                      verticalAlign: "top"
                    }}
                    to={`/u/${localStorage.id}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Avatar src={localStorage.icon} />
                  </Link>
                  <div
                    style={{
                      width: "calc(100% - 58px)",
                      display: "inline-block",
                      verticalAlign: "top"
                    }}
                  >
                    <div
                      style={{
                        width: "calc(100% - 58px)",
                        display: "inline-block",
                        verticalAlign: "top"
                      }}
                    >
                      <Link
                        className="Links"
                        to={`/u/${localStorage.id}`}
                        onClick={(e) => e.stopPropagation()}
                        style={{}}
                      >
                        <Typography
                          style={{
                            color: theme.palette.text.primary,
                            cursor: "pointer",
                            display: "inline-block",
                            overflow: "hidden",
                            fontSize: "16px",
                            maxWidth: "calc(100% - 64px)",
                            fontWeight: "bold",
                            lineHeight: "24px",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            verticalAlign: "top"
                          }}
                        >
                          {localStorage.name}
                        </Typography>
                      </Link>
                      <Typography
                        variant="body1"
                        style={{
                          color: "#828282",
                          display: "inline-block",
                          verticalAlign: "top"
                        }}
                      >{`@${localStorage.id}`}</Typography>
                    </div>
                    <div style={{ position: "relative" }}>
                      <Typography
                        variant="body1"
                        style={{
                          fontSize: "1rem",
                          fontFamily:
                            '"Roboto", "Helvetica", "Arial", sans-serif',
                          fontWeight: 400,
                          lineHeight: 1.5,
                          letterSpacing: "0.00938em",
                          wordWrap: "break-word"
                        }}
                      >
                        {content}
                      </Typography>
                    </div>
                    <div></div>
                  </div>
                </Paper>
              </div>
            </div>
            <div id="detail" style={{}}>
              <div
                style={{
                  margin: "0 0 26px 0",
                  borderRadius: "6px"
                }}
              >
                <Typography
                  style={{
                    color: theme.palette.text.primary,
                    margin: "0 auto",
                    fontSize: "36px",
                    textAlign: "center",
                    fontWeight: 600,
                    lineHeight: "44px"
                  }}
                  variant="h3"
                >
                  ${estimate}
                </Typography>
                <Typography
                  sx={{
                    color: theme.palette.text.secondary,
                    margin: "0 auto",
                    fontSize: "16px",
                    marginTop: "2px",
                    textAlign: "center",
                    lineHeight: "20px",
                    marginBottom: "18px"
                  }}
                  variant="h6"
                >
                  {parseFloat(estimate / exchangeRate).toFixed(8)} BSV
                </Typography>
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div style={{ flexGrow: 1 }} />
              <Button
                style={{
                  width: "257px",
                  padding: "14px",
                  fontSize: "16px",
                  fontWeight: 600,
                  lineWeight: "24px",
                  textTransform: "none"
                }}
                color="primary"
                variant="contained"
                onClick={handle1Click}
              >
                Twetch It!
              </Button>
              <div style={{ flexGrow: 1 }} />
            </div>
            <div style={{ height: "10vh" }} />
          </Paper>
          <div style={{ flexGrow: 1 }}></div>
        </div>
      </div>
    </main>
  );

  const twetchPost = async (text, replyTx) => {
    if (branchTx) {
      text = text + ` https://twetch.app/t/${branchTx}`;
    }
    const action = "twetch/post@0.0.1";
    const payload = {
      bContent: text,
      mapReply: replyTx,
      mapComment: type !== "default" ? `${ticker} #${type}` : ticker,
      clientIdentifier: config.ownerInfo.clientIdentifier
    };

    const abi = new BSVABI(JSON.parse(localStorage.getItem("abi")), { action });
    abi.fromObject(payload);

    const payeeResponse = await twetch.fetchPayees({
      args: abi.toArray(),
      action
    });
    let ownerRoyalty = {
      to: config.ownerInfo.address,
      amount: config.customization.eggshellRoyalty,
      currency: "BSV",
      user_id: config.ownerInfo.userId,
      types: ["eggshell_royalty"]
    };
    let customPayees = payeeResponse.payees;
    customPayees.push(ownerRoyalty);
    console.log(customPayees);
    let invoice = payeeResponse.invoice;

    try {
      await abi.replace({
        "#{invoice}": () => invoice
      });
      let arg = abi.action.args.find((e) => e.type === "Signature");
      const ab = abi
        .toArray()
        .slice(arg.messageStartIndex || 0, arg.messageEndIndex + 1);
      const contentHash = await digestMessage(ab);
      await abi.replace({
        "#{mySignature}": () => twetch.wallet.sign(contentHash),
        "#{myAddress}": () => twetch.wallet.address()
      });

      const tx = await twetch.wallet.buildTx(
        abi.toArray(),
        customPayees,
        action
      );

      twetch
        .publishRequest({
          signed_raw_tx: tx.toString(),
          invoice,
          action,
          broadcast: true
        })
        .then((resp) => {
          console.log(resp);
        });
    } catch (error) {
      console.log(error);
    }

    return;
    twetch
      .publish("twetch/post@0.0.1", payload)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container direction="column" style={{ padding: "16px" }}>
          <Grid item>
            <TextField
              placeholder={placeholder}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Avatar src={localStorage.getItem("icon")} />
                  </InputAdornment>
                )
              }}
              style={{ width: "100%" }}
              multiline
              rows={3}
              value={content}
              onChange={(event) => handleChangeContent(event)}
            />
            {quote.node && <Quote {...quote} tx={branchTx} />}
          </Grid>
          <Grid item>
            <div style={{ display: "flex" }}>
              <div style={{ flexGrow: 1 }}></div>
              <Paper
                elevation={24}
                style={{
                  top: "unset",
                  margin: "8px 0",
                  display: "inline-block",
                  position: "relative",
                  right: "0px",
                  width: "30px",
                  fontSize: "12px",
                  lineHeight: "20px",
                  borderRadius: "9px"
                }}
              >
                <Typography
                  style={{
                    color: getColor(),
                    padding: "0 4px",
                    fontSize: "12px",
                    textAlign: "center",
                    fontWeight: "bold",
                    lineHeight: "20px"
                  }}
                  variant="body1"
                >
                  {250 - content.length}
                </Typography>
              </Paper>
            </div>
          </Grid>
          <Grid item>
            <div style={{ display: "flex", width: "100%" }}>
              <div style={{ flexGrow: 1 }}></div>

              <div>
                <Button
                  style={{
                    height: "32px",
                    marginLeft: "16px",
                    marginTop: "10px",
                    textTransform: "none",
                    transition: "color .01s"
                  }}
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={!content || content.length > 256}
                  onClick={handleSubmit}
                >
                  ${estimate} Post
                </Button>
              </div>
            </div>
          </Grid>
        </Grid>
      </form>
      <Drawer
        style={{
          position: "fixed",
          inset: "0px"
        }}
        anchor="bottom"
        container={container}
        ModalProps={{
          keepMounted: true // Better open performance on mobile.
        }}
        onClose={handleDrawerToggle}
        open={open}
        variant="temporary"
      >
        {pay}
      </Drawer>
    </div>
  );
}
