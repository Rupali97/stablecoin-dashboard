import React from 'react'
import {
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Snackbar,
} from "@material-ui/core";
import validator from "validator";
import '../../styles/authStyle.css'

function Auth() {

  const [state, setState] = React.useState({ email: "", password: "" });

  const isValid = () =>
    validator.isEmail(state.email) && state.password.length > 4;

  const login = () => {}

  return (
    <div id={'auth'}>
       <div className="auth-container">
      <Card className="auth-container-card">
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Welcome to Stablecoin Dashboard
          </Typography>
          <Typography variant="body2" color="textSecondary">
            <p>
              This is the staff login. To access dashboard, please contact your
              administrator.
            </p>

            <TextField
              required
              id="outlined-email"
              label="Email"
              margin="dense"
              type="email"
              onChange={(e:any) => setState({ ...state, email: e.target.value })}
              value={state.email}
              fullWidth
            />

            <TextField
              required
              id="outlined-pass"
              label="Password"
              margin="dense"
              type="password"
              onChange={(e: any) => setState({ ...state, password: e.target.value })}
              value={state.password}
              fullWidth
            />
          </Typography>
        </CardContent>

        <CardActions>
          <Button
            disabled={!isValid()}
            onClick={login}
            variant="contained"
            color="primary"
          >
            Login
          </Button>
        </CardActions>
      </Card>
    </div>
    </div>
  )
}

export default Auth