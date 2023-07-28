import dts from "rollup-plugin-dts";
import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";

export default [
  {
    input: "src/newDatagram.ts",

    plugins: [nodeResolve(), typescript()],

    output: [
      {
        file: "./dist/newDatagram.js",
        format: "es",
      },
    ],
  },

  {
    input: "src/newDatagram.ts",

    plugins: [dts()],

    output: {
      file: "./dist/index.d.ts",

      format: "es",
    },
  },
];
