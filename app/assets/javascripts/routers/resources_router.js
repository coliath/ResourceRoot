App.Routers.Resources = Backbone.Router.extend({

  routes: {
    "": "demo",
    "home": "home",
    "resources/:id": "showReaderView"
  },

  initialize: function () {
    this.$content = $("#content");
    this.$navEl = $('#left-nav');
    this.$resourceEl = $('#resource-content');
    this.$socialEl = $("#social-content");
    this.$homeEl = $("#home");
  },

  home: function () {
    var home = new App.Views.Home();
    this.$content.hide();
    this.$homeEl.html(home.render().$el);
    this.$homeEl.show();
  },

  initResource: function ( id ) {
    var that = this;
    App.CurrentState.resource = new App.Models.Resource({ id: id });
    App.CurrentState.resource.fetch({
      success: function (resp) {
        that.showResource();
        that.showSiteNav();
        that.initNotes();
      }
    });
  },

  showSiteNav: function () {
    var siteNav = new App.Views.SiteNav();
    var renderedContent = siteNav.render().$el;
    this.$navEl.append(renderedContent);
    this.showTableOfContents();
  },

  showTableOfContents: function () {
    var tableOfContents = new App.Views.TableOfContents({ model: App.CurrentState.resource });
    var renderedContent = tableOfContents.render().$el;
    this.$navEl.append(renderedContent);
  },

  initHighlights: function ( resourceView ) {
    var that = this;
    App.CurrentState.resource.highlights = new App.Collections.Highlights([], {resource_id: App.CurrentState.resource.get("id")});
    App.CurrentState.resource.highlights.fetch({
      success: function (collection, resp, opt) {
        resourceView.displayHighlights();
      }
    });
  },

  showResource: function () {
    var showView = new App.Views.ResourceShow({ model: App.CurrentState.resource });
    this._swapView(this.$resourceEl, showView);
    this.initHighlights(showView);
  },

  initNotes: function () {
    var that = this;
    App.CurrentState.user.notes = new App.Collections.Notes([], {resource_id: App.CurrentState.resource.get("id")});
    App.CurrentState.user.notes.fetch({
      success: function (collection, resp, opt) {
        that.showNotes();
        that.initQuestions();
      }
    });
  },

  showNotes: function () {
    var notesIndex = new App.Views.NoteIndex({collection: App.CurrentState.user.notes});
    this._swapView(this.$socialEl, notesIndex);
  },

  initQuestions: function () {
    var that = this;
    App.CurrentState.resource.questions = new App.Collections.Questions([],{ resource_id: App.CurrentState.resource.get("id") });
    App.CurrentState.resource.questions.fetch({
      success: function (collection, resp, opt) {
        that.addQuestions();
        that.initDiscussions();
      }
    });
  },

  addQuestions: function () {
    var questionIndex = new App.Views.QuestionIndex({collection: App.CurrentState.resource.questions});
    this.$socialEl.append(questionIndex.render(true).$el);
  },

  initDiscussions: function () {
    var that = this;
    App.CurrentState.resource.discussions = new App.Collections.Discussions([],{ resource_id: App.CurrentState.resource.get("id") });
    App.CurrentState.resource.discussions.fetch({
      success: function (collection, resp, opt) {
        that.addDiscussions();
        that.addSocialNav();
      }
    });
  },

  addDiscussions: function () {
    var discussionIndex = new App.Views.DiscussionIndex({collection: App.CurrentState.resource.discussions});
    this.$socialEl.append(discussionIndex.render(true).$el);
  },

  addSocialNav: function () {
    App.socialNav = new App.Views.SocialNav();
    this.$socialEl.prepend(App.socialNav.render().$el);
    this.$homeEl.hide();
    this.$content.show();
    $(document).trigger("loaded");
  },

  demo: function () {
    this.initResource(1);
  },

  showReaderView: function ( id ) {
    this.initResource(id);
  },

  _swapView: function ( el, view ) {
    el.html(view.render().$el);
  },


});