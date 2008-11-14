require 'rake/packagetask'

Rake::PackageTask.new("dateedit", "0.0.1") do |p|
  p.package_dir = "./pkg"
  p.package_files.include("lib/**/*")
  p.package_files.include("ruby/**/*")
  p.package_files.include("ruby/*.html")
  p.need_zip = true
  p.need_tar_gz = true
end
