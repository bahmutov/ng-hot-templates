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

  function getRootModule() {
    return document.querySelector('[ng-app]').attributes['ng-app'];
  }

  // returns all element directive names found in page
  function getAllDirectives() {

  }

  // returns true if reloads a directive from given path
  function reloadAngularDirectiveTemplate(path) {

    var injector = angular.element(document.body).injector();
    var $templateCache = injector.get('$templateCache');
    if (!$templateCache.get(path)) {
      return;
    }
    $templateCache.remove(path);


    var appModule = getRootModule();
    if (!appModule || !appModule.value) {
      console.log('Could not find root module');
      return;
    }
    appModule = String(appModule.value);
    console.log('app module', appModule);
    // TODO grab all directives provided by all modules
    // see https://github.com/bahmutov/ng-ast
    // look at each module's _invokeQueue to see if there is a directive
    // keep walking down the dependent modules (requires)

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

    return true;
  }

  function ngTemplateReloadPlugin(window, options) {
    this.window = window;
    this.options = options;
  }
  ngTemplateReloadPlugin.identifier = 'ngTemplate';
  ngTemplateReloadPlugin.prototype.reload = function (path) {
    var result = reloadAngularDirectiveTemplate(path);
    console.log('need to reload ng template?', path, result);
    return result;
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
