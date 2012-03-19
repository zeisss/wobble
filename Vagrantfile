Vagrant::Config.run do |config|
  config.vm.box = "lucid32"
  config.vm.boot_mode = :gui
  # config.vm.network "33.33.33.10"

  # Forward a port from the guest to the host, which allows for outside
  # computers to access the VM, whereas host only networking does not.
  config.vm.forward_port 80, 8080
  config.vm.forward_port 8080, 8081

  # Share an additional folder to the guest VM. The first argument is
  # an identifier, the second is the path on the guest to mount the
  # folder, and the third is the path on the host to the actual folder.
  # config.vm.share_folder "v-data", "/vagrant_data", "../data"
  config.vm.share_folder "v-web", "/var/www", "web"

  #config.vm.provision :shell, :path => "install-vm.sh"

  # Enable provisioning with chef solo, specifying a cookbooks path (relative
  # to this Vagrantfile), and adding some recipes and/or roles.
  #
  config.vm.provision :chef_solo do |chef|
    chef.cookbooks_path = "shared/cookbooks"
    chef.add_recipe "apt"
    chef.add_recipe "openssl"
    chef.add_recipe "apache2"
    chef.add_recipe "mysql::client"
    chef.add_recipe "mysql::server"
    chef.add_recipe "php"
    chef.add_recipe "php::module_mysql"
    chef.add_recipe "php::module_curl"
    chef.add_recipe "apache2::mod_php5"
       
    # You may also specify custom JSON attributes:
    chef.json = {
      :mysql => {
        :server_root_password => "lamproot"
      }
    }
  end
end
