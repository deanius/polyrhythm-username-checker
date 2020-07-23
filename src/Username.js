import React, { useState } from "react";
import { takeUntil } from "rxjs/operators";

import { trigger, useListener, query, after, concat } from "polyrhythm";

export const UsernameField = ({ debounceTime = 500 }) => {
  const [username, setUsername] = useState("");

  const handleChange = event => {
    const { value } = event.target;
    setUsername(value);
    trigger("username/input", value);
  };

  useListener(
    "username/input",
    ({ payload: username }) => {
      return concat(
        after(debounceTime),
        after(0, () => {
          if (username.length >= 2) {
            trigger("username/check", username);
          }
        })
      );
    },
    { mode: "replace" }
  );

  return (
    <input
      onChange={handleChange}
      value={username}
      type="text"
      placeholder="ex: bgates151"
    />
  );
};

export const UsernameStatus = ({ queryTimeout = 3000 }) => {
  const [avail, setAvail] = useState("Unknown");
  const [fetching, setFetching] = useState(false);

  useListener("username/result", function displayResult({ payload }) {
    const { result, username } = payload;
    setAvail(username + (result ? " is Available 😀" : " is not Available 😝"));
    setFetching(false);
  });

  useListener("username/check", function showFetching({ payload: username }) {
    setAvail("");
    setFetching(true);

    return after(queryTimeout, () => {
      setAvail(`Username Service did not respond: ${username}`);
      setFetching(false);
    }).pipe(takeUntil(query(/username/)));
  });

  return (
    <div>
      <div>
        Result: {avail} {fetching && "⏳"}{" "}
      </div>
      <UsernameService />
    </div>
  );
};

const UsernameService = ({ debounceTime = 1000, resultDelay = 1500 }) => {
  useListener(
    "username/check",
    ({ payload: username }) => {
      return concat(
        after(debounceTime),
        after(resultDelay, () => {
          const fakeResult = !/no/.test(username);
          const skipResult = /unk/.test(username);
          if (!skipResult)
            trigger("username/result", { username, result: fakeResult });
        })
      );
    },
    { mode: "replace" }
  );
  return null;
};
