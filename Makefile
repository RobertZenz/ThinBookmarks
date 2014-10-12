BUILD = ./build
NAME = thinbookmarks@bonsaimind.org
SRC = ./src

all: $(BUILD)/$(NAME).xpi

$(BUILD)/$(NAME).xpi:
	mkdir --parent $(BUILD)
	cd $(SRC); zip -r ../$@ *; cd -
	
clean:
	$(RM) $(BUILD)/$(NAME).xpi
	$(RM) -R $(BUILD)

