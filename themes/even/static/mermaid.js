(async function () {
  var codeBlocks = document.querySelectorAll('pre > code[data-lang="mermaid"]');
  if (!codeBlocks.length) return;

  codeBlocks.forEach(function (code) {
    var diagram = document.createElement("pre");
    diagram.className = "mermaid";
    diagram.textContent = code.textContent;
    code.parentNode.replaceWith(diagram);
  });

  try {
    var module = await import("https://cdn.jsdelivr.net/npm/mermaid@12/dist/mermaid.esm.min.mjs");
    var mermaid = module.default;
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: "base",
      themeVariables: {
        background: "#fefefe",
        primaryColor: "#f8f5ec",
        primaryTextColor: "#34495e",
        primaryBorderColor: "#c05b4d",
        lineColor: "#c05b4d",
        secondaryColor: "#fffdf8",
        tertiaryColor: "#f8f5ec",
        clusterBkg: "#fbf9f4",
        clusterBorder: "#d8cfc0",
        edgeLabelBackground: "#fefefe"
      }
    });
    await mermaid.run({ nodes: document.querySelectorAll("pre.mermaid") });
  } catch (error) {
    console.error("Mermaid diagram rendering failed:", error);
  }
})();
