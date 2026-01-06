#!/bin/bash

# Fix all Prisma relation names in controllers
cd /Users/isachinsingh/Desktop/the-pizza-box/apps/api/src/controllers

# Fix lowercase relation names to capitalized
find . -name "*.ts" -type f -exec sed -i '' \
  -e 's/include: { items:/include: { Item:/g' \
  -e 's/include: { user:/include: { User:/g' \
  -e 's/include: { category:/include: { Category:/g' \
  -e 's/include: { variants:/include: { Variant:/g' \
  -e 's/include: { options:/include: { Option:/g' \
  -e 's/include: { addons:/include: { Addon:/g' \
  -e 's/include: { choices:/include: { Choice:/g' \
  -e 's/include: { feedback:/include: { Feedback:/g' \
  -e 's/include: { order:/include: { Order:/g' \
  -e 's/include: { deliveryPartner:/include: { DeliveryPartner:/g' \
  -e 's/include: { addresses:/include: { Address:/g' \
  -e 's/, items:/, Item:/g' \
  -e 's/, user:/, User:/g' \
  -e 's/, category:/, Category:/g' \
  -e 's/, variants:/, Variant:/g' \
  -e 's/, options:/, Option:/g' \
  -e 's/, addons:/, Addon:/g' \
  -e 's/, choices:/, Choice:/g' \
  -e 's/, feedback:/, Feedback:/g' \
  -e 's/, order:/, Order:/g' \
  -e 's/, deliveryPartner:/, DeliveryPartner:/g' \
  -e 's/, addresses:/, Address:/g' \
  {} \;

echo "Fixed all Prisma relation names!"
