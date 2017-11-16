const mongoose = require("mongoose");

let Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  headline: {
    type: String
  },
  summary: {
    type: String
  },
  img: {
    type: String
  },
  url: {
    type: String
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
})

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;