/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["extractMediaQueriesWebpackPlugin"] = factory();
	else
		root["extractMediaQueriesWebpackPlugin"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/plugin/index.js":
/*!*****************************!*\
  !*** ./src/plugin/index.js ***!
  \*****************************/
/***/ (() => {

eval("throw new Error(\"Module build failed (from ./node_modules/babel-loader/lib/index.js):\\nError: Cannot find module '@babel/core'\\nRequire stack:\\n- /home/turisap/code/plugin/node_modules/babel-loader/lib/index.js\\n- /home/turisap/code/plugin/node_modules/loader-runner/lib/loadLoader.js\\n- /home/turisap/code/plugin/node_modules/loader-runner/lib/LoaderRunner.js\\n- /home/turisap/code/plugin/node_modules/webpack/lib/NormalModule.js\\n- /home/turisap/code/plugin/node_modules/webpack/lib/NormalModuleFactory.js\\n- /home/turisap/code/plugin/node_modules/webpack/lib/Compiler.js\\n- /home/turisap/code/plugin/node_modules/webpack/lib/webpack.js\\n- /home/turisap/code/plugin/node_modules/webpack/lib/index.js\\n- /home/turisap/code/plugin/node_modules/webpack-cli/lib/webpack-cli.js\\n- /home/turisap/code/plugin/node_modules/webpack-cli/lib/bootstrap.js\\n- /home/turisap/code/plugin/node_modules/webpack-cli/bin/cli.js\\n- /home/turisap/code/plugin/node_modules/webpack/bin/webpack.js\\n babel-loader@8 requires Babel 7.x (the package '@babel/core'). If you'd like to use Babel 6.x ('babel-core'), you should install 'babel-loader@7'.\\n    at Function.Module._resolveFilename (node:internal/modules/cjs/loader:925:15)\\n    at Function.Module._load (node:internal/modules/cjs/loader:769:27)\\n    at Module.require (node:internal/modules/cjs/loader:997:19)\\n    at require (/home/turisap/code/plugin/node_modules/v8-compile-cache/v8-compile-cache.js:159:20)\\n    at Object.<anonymous> (/home/turisap/code/plugin/node_modules/babel-loader/lib/index.js:10:11)\\n    at Module._compile (/home/turisap/code/plugin/node_modules/v8-compile-cache/v8-compile-cache.js:192:30)\\n    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1137:10)\\n    at Module.load (node:internal/modules/cjs/loader:973:32)\\n    at Function.Module._load (node:internal/modules/cjs/loader:813:14)\\n    at Module.require (node:internal/modules/cjs/loader:997:19)\");\n\n//# sourceURL=webpack://extractMediaQueriesWebpackPlugin/./src/plugin/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./src/plugin/index.js");
/******/ })()
.ExtractMediaQueriesWebpackPlugin;
});