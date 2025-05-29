terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "resource_group" {
  name     = "nerdyweirdwords"
  location = "centralindia"
}

resource "azurerm_virtual_network" "virtual_network" {
  name                = "virtual_network"
  address_space       = ["192.168.0.0/16"]
  location            = azurerm_resource_group.resource_group.location
  resource_group_name = azurerm_resource_group.resource_group.name
}

resource "azurerm_subnet" "subnet" {
  name                 = "subnet"
  address_prefixes     = ["192.168.1.0/24"]
  resource_group_name  = azurerm_resource_group.resource_group.name
  virtual_network_name = azurerm_virtual_network.virtual_network.name
}

resource "azurerm_public_ip" "public_ip" {
  name                = "public_ip"
  allocation_method   = "Static"
  location            = azurerm_resource_group.resource_group.location
  resource_group_name = azurerm_resource_group.resource_group.name
  sku                 = "Standard"
}

resource "azurerm_network_interface" "network_interface" {
  name                = "network_interface"
  location            = azurerm_resource_group.resource_group.location
  resource_group_name = azurerm_resource_group.resource_group.name

  ip_configuration {
    private_ip_address            = "192.168.1.23"
    name                          = "internal"
    private_ip_address_allocation = "Static"
    public_ip_address_id          = azurerm_public_ip.public_ip.id
    subnet_id                     = azurerm_subnet.subnet.id
  }
}

resource "azurerm_network_security_group" "network_security_group" {
  name                = "network_security_group"
  location            = azurerm_resource_group.resource_group.location
  resource_group_name = azurerm_resource_group.resource_group.name

  security_rule {
    name                       = "SSH"
    access                     = "Allow"
    destination_address_prefix = "*"
    destination_port_range     = "22"
    direction                  = "Inbound"
    priority                   = 1000
    protocol                   = "Tcp"
    source_address_prefix      = "*"
    source_port_range          = "*"
  }

  security_rule {
    name                       = "HTTP"
    access                     = "Allow"
    destination_address_prefix = "*"
    destination_port_range     = "80"
    direction                  = "Inbound"
    priority                   = 1010
    protocol                   = "Tcp"
    source_address_prefix      = "*"
    source_port_range          = "*"
  }

  security_rule {
    name                       = "HTTPS"
    access                     = "Allow"
    destination_address_prefix = "*"
    destination_port_range     = "443"
    direction                  = "Inbound"
    priority                   = 1020
    protocol                   = "Tcp"
    source_address_prefix      = "*"
    source_port_range          = "*"
  }
}

resource "azurerm_subnet_network_security_group_association" "subnet_network_security_group_association" {
  network_security_group_id = azurerm_network_security_group.network_security_group.id
  subnet_id                 = azurerm_subnet.subnet.id
}

resource "azurerm_linux_virtual_machine" "virtual_machine" {
  name                  = "virtual_machine"
  admin_username        = "fabioscagliola"
  computer_name         = "nerdyweirdwords"
  location              = azurerm_resource_group.resource_group.location
  network_interface_ids = [azurerm_network_interface.network_interface.id]
  resource_group_name   = azurerm_resource_group.resource_group.name
  size                  = "Standard_B4als_v2"

  admin_ssh_key {
    username   = "fabioscagliola"
    public_key = file("~/.ssh/thecodetailors.com.pub")
  }

  os_disk {
    name                 = "storage_os_disk"
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "ubuntu-24_04-lts"
    sku       = "ubuntu-pro"
    version   = "latest"
  }
}

output "public_ip" {
  value = azurerm_public_ip.public_ip.ip_address
}

