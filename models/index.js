// exporting an object with our models so other files only need to import one file
module.exports = {
  Article: require("./Article"),
  Note: require("./Note")
};