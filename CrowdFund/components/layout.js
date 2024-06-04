import React from "react";
import Navbar from "./Header";

export default function Layout(props) {
  return (
    <div className="ui container">
      <link
        async
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
      />
      <Navbar />
      {props.children}
    </div>
  );
}
