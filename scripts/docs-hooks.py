"""Keep repository-relative source links useful in the rendered documentation."""
from pathlib import Path
import re
from urllib.parse import quote, urlsplit


def on_page_markdown(markdown, page, config, files):
    docs = Path(config['docs_dir']).resolve()
    repo = docs.parent
    source = Path(page.file.abs_src_path)

    def convert(match):
        label, target = match.groups()
        parsed = urlsplit(target)
        if parsed.scheme or target.startswith(('#', '/')):
            return match.group(0)
        destination = (source.parent / parsed.path).resolve()
        if destination.is_relative_to(docs):
            return match.group(0)
        if not destination.is_relative_to(repo) or not destination.exists():
            raise ValueError(f'Invalid source link in {source}: {target}')
        relative = quote(destination.relative_to(repo).as_posix(), safe='/')
        suffix = '#' + parsed.fragment if parsed.fragment else ''
        return f'[{label}](https://github.com/funsaized/ribbit/blob/main/{relative}{suffix})'

    return re.sub(r'\[([^\]]+)\]\(([^)]+)\)', convert, markdown)
