library(Rpdb)

f <- system.file("examples/PCBM_ODCB.pdb", package="Rpdb")
f <- "../pdb/pho.pdb"
f <- "../pdb/1IZL.pdb"
x <- read.pdb(f)

subset(x, x$atoms$eleid %in% sample(x$atoms$eleid, 10))

## Visualize the PDB file
visualize(x, mode = NULL)
range(x)
natom(x, HETATM=TRUE)   # 22804
natom(x, HETATM=FALSE)  # 19964
natom(x, x$atoms$resid)
natom(x, x$atoms$resname)    # all the amino acids, and:
                             #  MN  PHE  PHO
                             #   8 1492  136

subset(x, resname=="MN")$atoms
subset(x, resname=="CLA" & chainid=="A" & elename=="MG")$atoms
centres(x)
atoms(x)
subset(x, resname=="MN")$atoms
