App.Views.QuestionIndex = Backbone.View.extend({

  events: {
    'click #submit-question': 'submit',
  },

  initialize: function () {
    console.log("initialzie qI");
    var renderCB = this.render.bind(this);

    this.listenTo(this.collection, "add", renderCB);
    this.listenTo(this.collection, "remove", renderCB);
  },

  submit: function ( e ) {
    e.preventDefault();

    var attrs = $(e.target).closest('form').serializeJSON(); // this is a good place for a view prototype getFormData Function
    attrs.question.resource_id = App.CurrentState.resource.get("id");

    App.CurrentState.resource.questions.create(attrs, {wait: true});
  },

  template: JST['questions/index'],

  render: function () {
    var renderedContent = this.template({
      questions: this.collection
    });

    this.$el.html(renderedContent);

    return this;
  }

});