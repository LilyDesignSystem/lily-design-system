.PHONY: github-pages

# Push the docs site subdirectory out to the github-pages remote via
# git's subtree mechanism. See spec/monorepo-github-pages/index.md.
github-pages:
	git subtree push --prefix=lilydesignsystem.github.io github-pages main
