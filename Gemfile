source "https://rubygems.org"
ruby RUBY_VERSION

# Use GitHub Pages for hosting
gem "github-pages", group: :jekyll_plugins

# If you prefer to use the latest Jekyll directly instead of GitHub Pages
# uncomment this line and comment out the github-pages gem above
# gem "jekyll", "~> 4.3.2"

# Core plugins
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.17.0"
  gem "jekyll-assets", "~> 3.0.12"
  gem "jekyll-seo-tag", "~> 2.8.0"
  gem "jekyll-sitemap", "~> 1.4.0"
  gem "jekyll-paginate", "~> 1.1.0"
end

# Development tools
group :development do
  gem "webrick", "~> 1.8.2" # Required for Ruby 3+
end

# Platform specific gems
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
gem 'wdm', '~> 0.1.1', platforms: [:mingw, :mswin, :x64_mingw]
