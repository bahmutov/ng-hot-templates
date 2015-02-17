(function () {

  function nonAngularKey(key) {
    return !/^\$/.test(key);
  }

  function nonMethod(obj, key) {
    return typeof obj[key] !== 'function';
  }

  function deepClone(x) {
    return JSON.parse(JSON.stringify(x));
  }

  function reloadAngularDirectiveTemplate(path) {

    var injector = angular.element(document.body).injector();
    var $templateCache = injector.get('$templateCache');
    $templateCache.removeAll();

    var $compile = injector.get('$compile');
    var $timeout = injector.get('$timeout');
    var todos = document.querySelector('todos');
    var scope = angular.element(todos).scope();

    var ownProperties = Object.keys(scope)
      .filter(nonAngularKey)
      .filter(nonMethod.bind(null, scope));

    var clonedOwnScope = ownProperties.map(function (key) {
      return deepClone(scope[key]);
    });

    console.log('existing scope', scope);

    var compileFn = $compile(todos);
    var returns = compileFn(scope);

    // todo: when is template updated?

    $timeout(function () {
      console.log('restoring scope data', clonedOwnScope);
      ownProperties.forEach(function (key, k) {
        scope[key] = clonedOwnScope[k];
      });
    }, 100);
  }

  function ngTemplateReloadPlugin(window, host) {
    this.window = window;
    this.host = host;
  }
  ngTemplateReloadPlugin.identifier = 'ngTemplate';
  ngTemplateReloadPlugin.prototype.reload = function (path) {
    if (/todos\.html$/.test(path)) {
      console.log('need to reload ng template', path);
      reloadAngularDirectiveTemplate(path);
      return true;
    }
  };

  setTimeout(function () {
    if (typeof LiveReload !== 'undefined') {
      if (!LiveReload.hasPlugin(ngTemplateReloadPlugin.identifier)) {
        LiveReload.addPlugin(ngTemplateReloadPlugin);
        console.log('Registered ng hot template live reload plugin');
      }
    }
  }, 50);

}());
