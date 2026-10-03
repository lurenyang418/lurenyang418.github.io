# Even
Even is a clean, responsive theme based on the Hugo theme with the same name featuring categories, tags and pagination.

This version requires Zola 0.23.6 or newer.

![even screenshot](https://github.com/getzola/even/blob/master/screenshot.png?raw=true)

## Contents

- [Installation](#installation)
- [Options](#options)
  - [Top menu](#top-menu)
  - [Title](#title)

## Installation
First download this theme to your `themes` directory:

```bash
cd themes
git clone https://github.com/getzola/even.git
```
and then enable it in your `config.toml`:

```toml
theme = "even"
```

The theme requires tags and categories taxonomies to be enabled in your `config.toml`:

```toml
taxonomies = [
    # You can enable/disable RSS
    {name = "categories", feed = true},
    {name = "tags", feed = true},
]
```
If you want to paginate taxonomies pages, you will need to overwrite the templates
as it only works for non-paginated taxonomies by default.

It also requires to put the posts in the root of the `content` folder and to enable pagination, for example in `content/_index.md`:

```
+++
paginate_by = 5
sort_by = "date"
+++
```

## Options

### Top-menu
Set a field in `extra` with a key of `even_menu`:

```toml
# This is the default menu
even_menu = [
    {url = "$BASE_URL", name = "Home"},
    {url = "$BASE_URL/categories", name = "Categories"},
    {url = "$BASE_URL/tags", name = "Tags"},
    {url = "$BASE_URL/about", name = "About"},
]
```

If you put `$BASE_URL` in a url, it will automatically be replaced by the actual
site URL.

### Title
The site title is shown on the header. As it might be different from the `<title>`
element that the `title` field in the config represents, you can set the `even_title`
instead.

### KaTeX math formula support

This theme contains math formula support using [KaTeX](https://katex.org/),
which can be enabled by setting `katex_enable = true` in the `extra` section
of `config.toml`:

```toml
[extra]
katex_enable = true
```

Zola 0.23 removed shortcodes. With automatic rendering enabled, write formulas
using `\\( ... \\)` for inline math or `\\[ ... \\]` / `$$ ... $$` for display math:

```toml
[extra]
katex_enable = true
katex_auto_render = true
```

### Markdown features

The example config enables heading links and GitHub-style alerts. The theme styles
`NOTE`, `TIP`, `IMPORTANT`, `WARNING`, and `CAUTION` alerts. For example:

```md
> [!NOTE]
> Check the configuration before deploying.
```

Code blocks get a copy button. You can add a filename with Zola's `name`
annotation, for example `` ```rust,name=main.rs ``. Mermaid blocks keep their
diagram renderer and do not get a copy button.

If your site sets `skip_content_templating = ["**/*"]`, Markdown alerts, heading
links, and code blocks still work. Zola 0.23 components inside Markdown require
templating to be enabled for the relevant content files.

For individual pages, `hidden = true` keeps a page accessible by URL while
excluding it from listings, and `include_in_feeds = false` omits it from feeds.
