const checkEmailPassword = (email, password) => {
  let emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!email || !password) throw new Error("Please fill all the fields");

  if (!emailRegex.test(email)) throw new Error("Enter valid email");

  // password validation
  if (password.length < 6)
    throw new Error("Password cannot be less than 6 characters!");
};

export const signUp = async (name, email, password) => {
  try {
    checkEmailPassword(email, password);

    return await fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("from signup - 31", data);
        signIn(email, password);
      });
  } catch (error) {
    return { error };
  }
};

export const signIn = async (email, password, guestUser) => {
  try {
    if (!guestUser) checkEmailPassword(email, password);

    return await fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        guestUser,
      }),
    })
      .then((res) => res.json())
      .then((data) => data);
  } catch (error) {
    return { error };
  }
};
