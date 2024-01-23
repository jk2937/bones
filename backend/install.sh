#!/bin/bash

# Copyright 2024 Jonathan Kaschak
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

sudo apt -y update
sudo apt -y install python3-venv python3-pip
python3 -m venv venv
source venv/bin/activate
pip install flask
deactivate
