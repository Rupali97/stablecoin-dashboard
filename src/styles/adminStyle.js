import {
      drawerWidth,
      transition,
      container
    } from "./material-dashboard-react.js";
    
    const appStyle = theme => ({
      wrapper: {
        position: "relative",
        top: "0",
        height: "100%"
      },
      mainPanel: {
        [theme.breakpoints.up("md")]: {
          width: `calc(100% - ${drawerWidth}px)`
        },
        overflow: "auto",
        position: "relative",
        float: "right",
        ...transition,
        height: "100%",
        width: "100%",
        overflowScrolling: "touch"
      },
      content: {
        position: 'relative',
        // marginTop: "70px",
        // padding: "30px 0",
        height: '100%',
        // minHeight: "calc(100vh - 123px)"
      },
      container,
      map: {
        marginTop: "70px"
      }
    });
    
    export default appStyle;
    