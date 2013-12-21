App.Views.AnswerShow = Backbone.View.extend({

  initialize: function () {
    this.type = "Answer";
    App.Modules.makeCommentable(this);
  },

  template: JST['answers/show'],

  render: function () {
    var renderedContent = this.template({ answer: this.model });
    this.$el.html(renderedContent);
    this.renderComments(this.$el.find('.comments-wrapper'));
    return this;
  },

});