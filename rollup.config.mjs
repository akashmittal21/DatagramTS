import dts from "rollup-plugin-dts";
import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default [
  {
    input: "src/newDatagram.ts",

    plugins: [commonjs(), nodeResolve(), typescript()],

    output: {
      dir: "./dist",
      // file: "./dist/newDatagram.js",
      preserveModules: false,
      format: "es",
    },
  },

  // {
  //   input: "src/newDatagram.ts",

  //   plugins: [dts()],

  //   output: {
  //     file: "./dist/index.d.ts",

  //     format: "es",
  //   },
  // },
];
