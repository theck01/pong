require 'sinatra/base'
require 'sinatra/config_file'
require 'haml'
require './lib/sinatra/partials'
require './lib/sinatra/javascripts'
require './lib/sinatra/styles'

class PongApp < Sinatra::Base
  register Sinatra::ConfigFile
  helpers Sinatra::Partials
  helpers Sinatra::Javascripts
  helpers Sinatra::Styles

  config_file 'config.yml'

  # ROUTES

  get '/' do
    styles :application, :menus
    scripts :application, :pong
    @layout = { menu: 'menus/main' }
    @num_players = 0
    haml :main_page
  end

  get '/single' do
    styles :application, :menus
    scripts :application, :pong
    @layout = { menu: nil }
    @num_players = 1
    haml :main_page
  end

  get '/multi' do
    styles :application, :menus
    scripts :application, :pong
    @layout = { menu: nil }
    @num_players = 2
    haml :main_page
  end

  get '/howto' do
    styles :application, :menus
    scripts :application, :pong
    @layout = { menu: 'menus/howto' }
    @num_players = 0
    haml :main_page
  end

  # run the application if ruby file executed directly
  run! if app_file == $0
end
