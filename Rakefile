task :default => [:test]

task :clean do
  puts "Cleaning up old files"
  sh 'rm -rf shared/coverage-report/'
end

task :deploy do
  
end

task :test do
  sh 'phpunit --coverage-html=shared/coverage-report/'
end