import { makeStyles } from "@material-ui/core/styles"
import { NavLink } from "react-router-dom"
import classNames from "classnames"
import Divider from '@material-ui/core/Divider'
import Drawer from "@material-ui/core/Drawer"
import Fab from '@material-ui/core/Fab'
import Hidden from "@material-ui/core/Hidden"
import Icon from "@material-ui/core/Icon"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import MenuIcon from '@material-ui/icons/Menu'
import React from "react"
import styles from "../../styles/components/sidebarStyle.js"
import useCore from "../../hooks/useCore"
import { useGetActiveBlockChain } from "../../state/chains/hooks"


// @ts-ignore
const useStyles = makeStyles(styles)


export default function Sidebar () {
  const {myAccount} = useCore()
  const chain = useGetActiveBlockChain()
  const [state, setState] = React.useState<boolean>(false)

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) return
    setState(open)
  }


  const classes = useStyles()
  // verifies if routeName is the one active (in browser input)
  function activeRoute(routeName: any) {
    if (!routeName) return false
    return window.location.href.indexOf(routeName.url) > -1 ? true : false
  }

  const routes = [
    {
      url: '/dashboard/mint',
      icon: 'construction',
      name: 'Mint token'
    },
    {
      url: '/dashboard/burn',
      icon: 'whatshot',
      name: 'Burn token'
    },
    {
      url: '/dashboard/freeze',
      icon: 'ac_unit',
      name: 'Freeze'
    },
    {
      url: '/dashboard/admin',
      icon: 'supervisor_account',
      name: 'Admin'
    },
    // {
    //   url: '/statistics',
    //   icon: 'signal_cellular_alt',
    //   name: 'Statistics'
    // },
  ]

  const links = (
    <List className={classes.list}>
      {
        routes.map(r => {
          return (
            <NavLink onClick={() => {
              // setTimeout(() => {window.location.reload()}, 2000)
              }}
              key={r.name} to={
                chain == "Nile" && window.tronWeb?.defaultAddress.hex ? r.url : chain == "Goerli" && myAccount ? r.url : "/dashboard"
              } className={({isActive}) => isActive ? `active ${classes.item}` : classes.item}>
              <ListItem button className={classes.itemLink}>
                <Icon className={classNames(classes.itemIcon)}>{r.icon}</Icon>
                <ListItemText primary={r.name} className={classNames(classes.itemText)} disableTypography={true} />
              </ListItem>
            </NavLink>
          )
        })
      }
    </List>
  )

  var brand = (
    <div className={classes.logo}>
      <div className={classNames(classes.logoLink)}>Stablecoin Dashboard</div>
    </div>
  )

  return (
    <div>
      <Hidden mdUp implementation="css">
        <Fab
          size="small"
          color="secondary" aria-label="add"
          style={{ outline: 'none', position: 'fixed', bottom: 15, right: 15, zIndex: 100, backgroundColor: "#3f046d" }}>
          <MenuIcon onClick={toggleDrawer(true)} />
        </Fab>

        <Drawer
          variant="temporary"
          open={state}
          anchor={"right"}
          classes={{ paper: classNames(classes.drawerPaper) }}
          onClose={toggleDrawer(false)}
          >
          {brand}
          <Divider />
          <div className={classes.sidebarWrapper}>{links}</div>
        </Drawer>
      </Hidden>

      <Hidden smDown implementation="css">
        <Drawer
          anchor={"left"}
          variant="permanent"
          open
          classes={{ paper: classNames(classes.drawerPaper) }}>
          {brand}
          <Divider />
          <div className={classes.sidebarWrapper}>{links}</div>
        </Drawer>
      </Hidden>
    </div>
  )
}
