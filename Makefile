##
# Makefile for Lily Design System.
##

##
# make: Display this help message.
##
.PHONY: default
default: help

##
# make help: Display this help message.
##
.PHONY: help
help:
	@awk '/^##/{a=1-a}a' $(MAKEFILE_LIST) | cut -c3-

# newline: This is a print helper when you want to embed a newline in a message.
define newline


endef

##
# make check: Check this project, such as printing some of its important tools, their versions, and paths. This task is intended to help with installation, debugging, and maintenance.
##
.PHONY: check
check::
	@echo "Check this project, such as printing some of its important tools, their versions, and paths. This task is intended to help with installation, debugging, and maintenance."

check:: check-uname check-pnpm

##
# make check-uname: Print the uname information of the system.
##
.PHONY: check-uname
check-uname:
	@echo "\n### uname ###"
	uname -a

##
# make check-pnpm: Print the version and path of the command `pnpm`.
##
.PHONY: check-pnpm
check-pnpm:
	@echo "\n### pnpm ###"
	pnpm --version || true
	which -a pnpm || true

##
# make lint: Proofread everything.
##
.PHONY: lint
lint: lint-markdown

##
# make lint-markdown: Proofread Markdown files.
##
.PHONY: lint-markdown
lint-markdown:
	npx prettier --check "**/*.md"
	bin/check-links

##
# make publish-github-pages: Publish the website subproject to its own sibling repository.
##
.PHONY: publish-github-pages
publish-github-pages:
	bin/publish-github-pages

##
# make test: Test everything.
##
.PHONY: test
test: test-github-discussions

##
# make test-github-discussions: Test GitHub Discussions.
##
.PHONY: test-github-discussions
test-github-discussions:
	./bin/test-github-discussions
