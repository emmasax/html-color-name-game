require 'rubygems'
require 'bundler/setup'
require 'sinatra'
require 'haml'
require 'sass/plugin/rack'

use Sass::Plugin::Rack

configure do
  set :views, File.expand_path(File.join(File.dirname(__FILE__), 'views'))
  set :public, File.expand_path(File.join(File.dirname(__FILE__), 'public'))
  set :haml, { :attr_wrapper => '"', :format => :html5, :layout => :'layout.html' }
end

configure :development do
  require 'sinatra/reloader'
  Sinatra::Application.also_reload "lib/**/*.rb"
end

configure :production do
end

not_found do
  haml :'not_found.html'
end

error do
  haml :'error.html'
end

get '/' do
  haml :'index.html'
end

get '/timer' do
  haml :'timer.html'
end