require 'sinatra/base'

module Sinatra
  module CSS

    # routes method adds route specific css stylesheet filenames to @css
    def css (*stylesheets)
      @css ||= []
      @css << stylesheets
    end

    # view method transforms all css filenames global to app (from settings.css)
    # and local to route (@js) into valid html
    def stylesheets
      sheets = []
      sheets << settings.css.keys if settings.css
      sheets << @css if @css
      sheets.flatten.uniq.map do |css|
        "<link href='#{path_to_css css.to_s}' rel='stylesheet' type='text/css'>"
      end.join
    end

    protected

    def path_to_css (stylesheet)
      
      global_sheets = settings.stylesheets if settings.respond_to?('stylesheets')
      global_sheets ||= {}

      if settings.respond_to?('local_stylesheet_path')
        local_path = settings.local_stylesheet_path
      end
      local_path ||= '/'
      
      path = global_sheets[stylesheet] 
      path ||=  local_path + stylesheet + '.css'
    end
  end

  helpers CSS
end
