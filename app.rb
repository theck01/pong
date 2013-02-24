require 'sinatra'
require 'sinatra/config_file'
require 'haml'
require './lib/sinatra/partials'
require './lib/sinatra/javascripts'
require './lib/sinatra/styles'

config_file 'config.yml'

# ROUTES

get '/' do
  styles :menu, :main
  scripts :menu
  @layout = { menu: :main }
  haml :menu
end
