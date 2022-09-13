import {
  drawerWidth,
  transition,
  defaultFont,
  whiteColor,
  grayColor,
  blackColor,
  hexToRgb
} from "../material-dashboard-react.js";

const sidebarStyle = theme => ({
  drawerPaper: {
    border: "none",
    position: "fixed",
    top: "0",
    backgroundColor: '#2d004c',
    bottom: "0",
    left: "0",
    zIndex: "1",
    width: drawerWidth,
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      position: "fixed",
      height: "100%"
    },
    [theme.breakpoints.down("sm")]: {
      width: drawerWidth,
      position: "fixed",
      display: "block",
      top: "0",
      height: "100vh",
      right: "0",
      left: "auto",
      zIndex: "1032",
      visibility: "visible",
      overflowY: "visible",
      borderTop: "none",
      textAlign: "left",
      paddingRight: "0px",
      paddingLeft: "0",
      transform: `translate3d(${drawerWidth}px, 0, 0)`,
      ...transition
    }
  },
  logo: {
    position: "relative",
    padding: "15px 15px",
    zIndex: "4",
    "&:after": {
      content: '""',
      position: "absolute",
      bottom: "0",

      height: "1px",
      right: "15px",
      width: "calc(100% - 30px)",
      backgroundColor: "rgba(" + hexToRgb(grayColor[6]) + ", 0.3)"
    }
  },
  logoLink: {
    ...defaultFont,
    padding: "5px 0",
    display: "block",
    fontSize: "25px",
    fontWeight: "200",
    textAlign: 'center',
    lineHeight: "30px",
    textDecoration: "none",
    backgroundColor: "transparent",
    "&,&:hover": {
      color: whiteColor
    }
  },
  logoLinkRTL: {
    textAlign: "right"
  },
  logoImage: {
    width: "30px",
    display: "inline-block",
    maxHeight: "30px",
    marginLeft: "10px",
    marginRight: "15px"
  },
  img: {
    width: "35px",
    top: "22px",
    position: "absolute",
    verticalAlign: "middle",
    border: "0"
  },
  background: {
    position: "absolute",
    zIndex: "1",
    height: "100%",
    width: "100%",
    display: "block",
    top: "0",
    left: "0",
    backgroundSize: "cover",
    backgroundPosition: "center center",
    "&:after": {
      position: "absolute",
      zIndex: "3",
      width: "100%",
      height: "100%",
      content: '""',
      display: "block",
      background: blackColor,
      opacity: ".8"
    }
  },
  list: {
    marginTop: "20px",
    paddingLeft: "0",
    paddingTop: "0",
    paddingBottom: "0",
    marginBottom: "0",
    listStyle: "none",
    position: "unset"
  },
  item: {
    position: "relative",
    display: "block",
    textDecoration: "none",
    color: 'rgb(149, 134, 165)',
    "&:hover,&:focus,&:visited,&.active": {
      color: '#fff'
    }
  },
  itemLink: {
    width: "auto",
    transition: "all 300ms linear",
    margin: "0",
    borderRadius: "3px",
    position: "relative",
    display: "block",
    padding: "10px",
    backgroundColor: "transparent",
    ...defaultFont
  },
  itemIcon: {
    width: "24px",
    height: "30px",
    fontSize: "24px",
    lineHeight: "30px",
    float: "left",
    margin: "0 15px",
    textAlign: "center",
    verticalAlign: "middle",
    // color: 'rgb(149, 134, 165)'
  },
  itemText: {
    ...defaultFont,
    margin: "0",
    lineHeight: "30px",
    fontWeight: 'bold',
    fontSize: "14px",
    // color: 'rgb(149, 134, 165)'
  },
  sidebarWrapper: {
    position: "relative",
    height: "calc(100vh - 75px)",
    overflow: "auto",
    width: "220px",
    zIndex: "4",
    overflowScrolling: "touch"
  },
  fab: {
    position: 'fixed',
    bottom: 15,
    right: 15
  }
});

export default sidebarStyle;
