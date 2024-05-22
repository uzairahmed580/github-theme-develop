(function (algolia) {
  "use strict";

  const { autocomplete, getAlgoliaResults } = window['@algolia/autocomplete-js'];
  const { createQuerySuggestionsPlugin } = window['@algolia/autocomplete-plugin-query-suggestions'];
  const { createAlgoliaInsightsPlugin } = window['@algolia/autocomplete-plugin-algolia-insights'];
  const { createInsightsMiddleware } = window.instantsearch.middlewares;

  algolia.externals = {
    // Export the required librarires
    instantsearch: window.instantsearch,
    algoliasearch: window.algoliasearch,
    autocomplete,
    getAlgoliaResults,
    createAlgoliaInsightsPlugin,
    createQuerySuggestionsPlugin,
    createInsightsMiddleware,
    insightsClient: window.aa,
    html: window.htmPreact.html,
    render: window.htmPreact.render,

    // Export the required widgets
    widgets: {
      rangeSlider: window.instantsearch.widgets.rangeSlider,
      menu: window.instantsearch.widgets.menu,
      refinementList: window.instantsearch.widgets.refinementList,
      searchBox: window.instantsearch.widgets.searchBox,
      stats: window.instantsearch.widgets.stats,
      sortBy: window.instantsearch.widgets.sortBy,
      clearRefinements: window.instantsearch.widgets.clearRefinements,
      panel: window.instantsearch.widgets.panel,
      hits: window.instantsearch.widgets.hits,
      pagination: window.instantsearch.widgets.pagination,
      configure: window.instantsearch.widgets.configure,
      rangeInput: window.instantsearch.widgets.rangeInput,
    },

    // Export InstantSearch connectors
    connectors: {
      connectCurrentRefinements:
      instantsearch.connectors.connectCurrentRefinements,
    },
  };
})(window.algoliaShopify);