// START CUSTOM REVEAL.JS INTEGRATION
(function() {
	if( typeof window.addEventListener === 'function' ) {

		var compile = function (code, targetNode) {
			console.log("compiling", code);
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

		var run = function (source, consoleElem) {
			var nativeLog = window.console.log;
			consoleElem.innerHTML = "";
			window.console.log = function () {
				var text = document.createTextNode(arguments[0] + "\n");
				consoleElem.appendChild(text);
				nativeLog.apply(this, arguments);
			};
			eval(source);
			window.console.log = nativeLog;
		};

		var applyCodeFormatting = function (slide) {
			var codeNodes = slide.querySelectorAll( '.source' );
			if (codeNodes.length > 0) {
				var code = codeNodes[0];
				var compileOnly = code.className.indexOf("compile-only") > -1;
				code.className = "";
				var cm = CodeMirror.fromTextArea(code, { mode: "coffeescript", theme: "solarized" });
				var compiledElem = document.createElement("div");
				var compiledHtml = "<pre><code class='javascript'></code></pre>";
				compiledElem.innerHTML = compiledHtml;
				code.parentElement.insertBefore(compiledElem, null);
				var compileCode = function () {
					var compiled = compile(cm.getValue(), compiledElem.getElementsByTagName("code")[0]);
					if (compiled && !compileOnly) {
						run(compiled, consoleElem);
					}
				};
				if (!compileOnly) {
					var buttonElem = document.createElement("button");
					buttonElem.innerHTML = "Compile & Run";
					code.parentElement.insertBefore(buttonElem, compiledElem);
					var consoleElem = document.createElement("pre");
					consoleElem.innerHTML = "<code class='console'></code>";
					code.parentElement.insertBefore(consoleElem, null);
					buttonElem.addEventListener("click", compileCode);
				} else {
					compileCode();
					cm.on("change", compileCode);
				}
				//cm.on("change", );
			}
			/*
			for( var i = 0, len = codeNodes.length; i < len; i++ ) {
				var element = codeNodes[i];
				var container = document.createElement("div");
				container.className = 'code-container';
				var sourceNode = document.createElement("pre");
				var sourceCodeNode = document.createElement("code");
				sourceCodeNode.setAttribute('contenteditable', true);
				sourceCodeNode.className = 'coffeescript';
				sourceCodeNode.innerHTML = element.innerHTML;
				sourceNode.appendChild(sourceCodeNode);
				container.appendChild(sourceNode);
				hljs.highlightBlock(sourceCodeNode);
				element.parentElement.insertBefore(container, element);

				var runButton = document.createElement('button');
				runButton.innerHTML = "Compile & Run";

				container.appendChild(runButton);
				runButton.addEventListener('click', run);

				var compiledNode = document.createElement("pre");
				var compiledCodeNode = document.createElement("code");
				compiledCodeNode.className = 'javascript';

				compiledNode.appendChild(compiledCodeNode);
				container.appendChild(compiledNode);
				compile(element.innerText, compiledCodeNode);

				var consoleNode = document.createElement('pre');
				var consoleCodeNode = document.createElement('code');
				consoleNode.className = 'console';
				consoleCodeNode.appendChild(consoleNode);
				container.appendChild(consoleNode);
			}
			*/
		};

		var removeCodeFormatting = function (slide) {
			var nodes = slide.querySelectorAll('.code-container');
			for( var i = 0, len = nodes.length; i < len; i++ ) {
				var element = nodes[i];
				element.parentElement.removeChild(element);
			}
		};

		
		
		/*
		for( var i = 0, len = codeNodes.length; i < len; i++ ) {
			var element = codeNodes[i];

			element.setAttribute('contenteditable', 'true');
			var node = document.createElement('pre');
			var compiledNode = document.createElement('code');
			compiledNode.className = 'javascript';
			node.appendChild(compiledNode);
			var parent = element.parentElement.parentElement;
			parent.appendChild(node);

			compile(element.innerText, node);

		}*/

		applyCodeFormatting(Reveal.getCurrentSlide());
		Reveal.addEventListener( 'slidechanged', function( event ) {
			//removeCodeFormatting(event.previousSlide);
			applyCodeFormatting(event.currentSlide);
		});
	}
})();
// END CUSTOM REVEAL.JS INTEGRATION