function Prototypein( context, dependencies ){

  if( this instanceof Prototypein ){
    return createInheritance.apply( this, arguments );
  }
  var args;
  if( arguments.length > 1 ){
    args = Array.prototype.slice.apply( arguments, 1 );
    return assertInheritance.apply( arguments[0], args );
  }
  args = arguments.callee.caller.depends || [];
  return assertInheritance.apply( arguments[0], args );

  function assertInheritance( context, dependencies ){
    if( !dependencies ) return true;
    if( !( dependencies instanceof Array ) ){
      //TODO: Add IE7 support?
      dependencies = Array.prototype.slice.call( arguments, 1 );
    }
    for( var i = 0, m = dependencies.length; i < m; i++ ){
      if( !( context instanceof dependencies[i] ) ){
        for( var parent = context; parent; ){
          if( parent.constructor === dependencies[i] ) break;
          else parent = parent.getOwnPrototype && parent.getOwnPrototype();
        }
        if( !parent ) return false;
      }
    }

    return true;
  }

  function createInheritance( chain ){
    if( !( chain instanceof Array ) ){
      //TODO: Add IE7 support?
      chain = Array.prototype.slice.call( arguments );
    }
    function forEachConstructor( Constructor, proto ){
      var defaultPrototype = Constructor.prototype;
      proto = proto || Object.prototype;
      Constructor.prototype = proto;
      var result = new Constructor();
      result.constructor = Constructor;
      result.getOwnPrototype = function(){ return proto; };
      Constructor.prototype = defaultPrototype;
      if( !( Constructor.protoInstances instanceof Array ) ){
        Constructor.protoInstances = [];
      }
      var chain = [];
      for( var parent = proto; parent; ){
        if( parent.getOwnPrototype && parent.constructor ){
          chain.push( parent.constructor );
        }
        parent = parent.getOwnPrototype && parent.getOwnPrototype();
      }
      Constructor.protoInstances.push({
        instance: result,
        prototypeChain: chain
      });
      return result;
    }
    function getProtoInstance( Constructor, deps ){
      var result;
      if( Constructor.protoInstances ){
        for( var i = 0, m = Constructor.protoInstances.length; i < m; i++ ){
          var inst = Constructor.protoInstances[i];
          if( deps.length === 0 ){
            if( inst.prototypeChain.length !== 0 ) continue;
            return inst.instance;
          }
          if( inst.prototypeChain.length  !== deps.length ) continue;
          for( var j = 0, n = deps.length; j < n; j++ ){
            result = inst.instance;
            if( deps[j] !== inst.prototypeChain[i] ){
              result = undefined;
            }
            if( result ) return result;
          }
        }
      }
    }
    for( var i = chain.length - 1, j = 0, proto; i >= 0; i--, j++ ){
      if( typeof chain[i] !== 'function' ){
        throw new TypeError( 'Illegal constructor in the chain' );
      }
      var inst;
      if( i > j ){
        inst = getProtoInstance( chain[j], chain.slice( j + 1 ) );
        if( inst ) return inst;
      }
      inst = getProtoInstance( chain[i], chain.slice( i + 1 ) );
      if( inst ) {
        proto = inst;
        continue;
      }
      proto = forEachConstructor( chain[i], proto );
    }
    return proto;
  }
}
