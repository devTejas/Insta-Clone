import { setItemLS } from "../services/useLocalStorage";

export const initialState = null;

export const reducer = (state, action) => {
  if (action.type === "USER") return action.payload;
  if (action.type === "CLEAR") return null;
  // if currentUser follows anyone, then dispatch is triggered with the userid of user followed & followState that tells `follow/unfollow`
  // used only for updating following of the logged in user
  if (action.type === "UPDATE") {
    const { userid, followState } = action.payload;
    let following = state.following;
    if (followState === "follow") following.push(userid);
    else following = following.filter((id) => id !== userid);
    // console.log("update", action, state);
    setItemLS("user", { ...state, following });
    return { ...state, following };
  }
  return state;
};
