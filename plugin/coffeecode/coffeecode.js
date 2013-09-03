// START CUSTOM REVEAL.JS INTEGRATION
var CoffeeCode = (function() {
	if( typeof window.addEventListener === 'function' ) {
		var compile = function () {
			var slide = Reveal.getCurrentSlide();
			var code = slide.cm.getValue();
			var targetNode = slide.codeTarget;
			var compiledCode = "";
			try {
				compiledCode = CoffeeScript.compile(code);
				targetNode.style.display = "block";
				targetNode.dataset.compiled = compiledCode;
				targetNode.innerHTML = compiledCode;
				hljs.highlightBlock(targetNode);
				Reveal.sync();
				return compiledCode;
			} catch(e) {
				targetNode.style.display = "none";
				console.log(e);
			}
			return null;
		};

		var run = function (source) {
			var consoleElem = Reveal.getCurrentSlide().consoleElem;
			var nativeLog = window.console.log;
			consoleElem.innerHTML = "";
			consoleElem.style.display = "none";
			window.console.log = function () {
				consoleElem.style.display = "block";
				var text = document.createTextNode(arguments[0] + "\n");
				consoleElem.appendChild(text);
				nativeLog.apply(this, arguments);
				Reveal.sync();
			};
			eval(source);
			window.console.log = nativeLog;
		};

		var applyCodeFormatting = function () {
			var slide = Reveal.getCurrentSlide();
			var codeNodes = slide.querySelectorAll( '.source' );
			if (codeNodes.length > 0) {
				var code = codeNodes[0];
				var compileOnly = code.className.indexOf("compile-only") > -1;
				code.className = "";

				slide.cm = CodeMirror.fromTextArea(code, { mode: "coffeescript", theme: "solarized" });
				var compiledElem = document.createElement("div");

				var compiledHtml = "<pre><code class='javascript' style='display:none'></code></pre>";
				compiledElem.innerHTML = compiledHtml;
				code.parentElement.insertBefore(compiledElem, null);
				var compileCode = function () {
					var compiled = compile();
					if (compiled && !compileOnly) {
						run(compiled, consoleElem);
					}
				};
				slide.codeTarget = compiledElem.getElementsByTagName("code")[0];
				if (!compileOnly) {
					var buttonElem = document.createElement("button");
					buttonElem.innerHTML = "Compile & Run";
					code.parentElement.insertBefore(buttonElem, compiledElem);
					var consoleElem = document.createElement("pre");
					consoleElem.innerHTML = "<code class='console'></code>";
					code.parentElement.insertBefore(consoleElem, null);
					buttonElem.addEventListener("click", compileCode);
					slide.consoleElem = consoleElem;


				} else {
					compileCode();
					cm.on("change", compileCode);
				}
			}
		};

		var removeCodeFormatting = function (slide) {
			var nodes = slide.querySelectorAll('.code-container');
			for( var i = 0, len = nodes.length; i < len; i++ ) {
				var element = nodes[i];
				element.parentElement.removeChild(element);
			}
		};


		applyCodeFormatting(Reveal.getCurrentSlide());
		Reveal.addEventListener( 'slidechanged', function( event ) {
			//removeCodeFormatting(event.previousSlide);
			applyCodeFormatting(event.currentSlide);
		});

		var compileAndRun = function () {
			var code = compile();
			run(code);
		};

		return {
			compileAndRun: compileAndRun
		};
	}
})();
// END CUSTOM REVEAL.JS INTEGRATION