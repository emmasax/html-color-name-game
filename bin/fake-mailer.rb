#!/usr/bin/ruby
path = 'log'
Dir.mkdir(path) if !File.exists?(path)
File.open("#{path}/mail.log", "w+") do |f|
  f.puts ARGV.inspect
  $stdin.each_line { |line| f.puts line }
end