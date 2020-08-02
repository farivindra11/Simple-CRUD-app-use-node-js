const readline = require('readline')
const sqlite3 = require('sqlite3').verbose();
var Table = require('cli-table');


let db = new sqlite3.Database('./university.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) throw err;
    // console.log("Koneksi ke database berhasil!");
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function printLine() {
    console.log('======================================================');
}

// FUNGSI LOGIN
function login() {
    printLine();
    console.log(`
Welcome to Universitas Pendidikan Indonesia
Jl Setiabudi No. 255
`);
    printLine();
    rl.question('username: ', (user) => {
        printLine();
        rl.question('password: ', (pass) => {
            printLine();
            db.serialize(() => {
                let sql = 'SELECT * FROM user WHERE username=? AND password=?'
                db.get(sql, [user, pass], (err, row) => {
                    if (err)
                        throw err;
                    if (row) {
                        console.log(`Welcome, ${row.username}. Your acces level is: ${row.acces}`);
                        mainMenu()
                    } else {
                        console.log('Username/Password yang anda masukkan salah!');
                        login();
                    }
                });
            });
        });
    });

};
login();

//MAHASISWA
class Mahasiswa {

    viewMahasiswa(next) {
        let sql = `SELECT * FROM mahasiswa`;
        this.table = new Table({
            head: ['nim', 'nama', 'alamat', 'jurusan'],
            colWidths: [10, 10, 20, 10]
        });
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error(err);
            }
            for (let i = 0; i < rows.length; i++) {
                this.table.push([rows[i].nim, rows[i].nama, rows[i].alamat, rows[i].jurusan]);
            }
            console.log(this.table.toString());
            next();
        })
    }

    searchMahasiswa(nim, next) {
        let sql = `SELECT * FROM mahasiswa WHERE nim = ?`;
        db.get(sql, [nim], (err, row) => {
            if (err)
                throw err;
            if (row) {
                printLine();
                console.log('student detail');
                printLine();
                console.log(`NIM        : ${nim}`);
                console.log(`Nama       : ${row.nama}`);
                console.log(`alamat     : ${row.alamat}`);
                console.log(`jurusan    : ${row.jurusan}`);
            } else {
                console.log(`mahasiswa dengan nim ${nim} tidak terdaftar`);
            }
            next();
        })
    }

    addMahasiswa(nim, nama, alamat, jurusan, next) {
        let sql = `INSERT INTO mahasiswa(nim,nama,alamat,jurusan) VALUES (?,?,?,?)`;
        let sql2 = `SELECT * FROM mahasiswa`;
        db.run(sql, [nim, nama, alamat, jurusan], (err) => {
            if (err) {
                console.error(err.message);
            }
            this.table = new Table({
                head: ['nim', 'nama', 'alamat', 'jurusan'],
                colWidths: [10, 10, 20, 10]
            });
            db.all(sql2, [], (err, rows) => {
                if (err) {
                    console.error(err);
                }
                for (let i = 0; i < rows.length; i++) {
                    this.table.push([rows[i].nim, rows[i].nama, rows[i].alamat, rows[i].jurusan]);
                }
                console.log(this.table.toString());
                next();
            })
        })
    }

    deleteMahasiswa(nim, next) {
        let sql = `DELETE FROM mahasiswa WHERE nim = ?`;
        db.run(sql, nim, (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log(`Mahasiswa dengan nim: ${nim} telah dihapus`);
            next();
        });
    }
}

//JURUSAN
class Jurusan {

    viewJurusan(next) {
        let sql = `SELECT * FROM jurusan`;
        this.table = new Table({
            head: ['id_jurusan', 'nama_jurusan'],
            colWidths: [10, 30]
        });
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error(err);
            }
            for (let i = 0; i < rows.length; i++) {
                this.table.push([rows[i].id_jurusan, rows[i].nama_jurusan]);
            }
            console.log(this.table.toString());
            next();
        })
    }

    searchJurusan(id_jurusan, next) {
        let sql = `SELECT * FROM jurusan WHERE id_jurusan = ?`;
        db.get(sql, [id_jurusan], (err, row) => {
            if (err)
                throw err;
            if (row) {
                printLine();
                console.log('Detail jurusan');
                printLine();
                console.log(`id_jurusan        : ${id_jurusan}`);
                console.log(`Nama_jurusan       : ${row.nama_jurusan}`);
            } else {
                console.log(`jurusan dengan id_jurusan ${id_jurusan} tidak terdaftar`);
            }
            next();
        })
    }

    addJurusan(id_jurusan, nama_jurusan, next) {
        let sql = `INSERT INTO jurusan(id_jurusan,nama_jurusan) VALUES (?,?)`;
        let sql2 = `SELECT * FROM jurusan`;
        db.run(sql, [id_jurusan, nama_jurusan], (err) => {
            if (err) {
                console.error(err.message);
            }
            this.table = new Table({
                head: ['id_jurusan', 'nama_jurusan'],
                colWidths: [10, 30]
            });
            db.all(sql2, [], (err, rows) => {
                if (err) {
                    console.error(err);
                }
                for (let i = 0; i < rows.length; i++) {
                    this.table.push([rows[i].id_jurusan, rows[i].nama_jurusan]);
                }
                console.log(this.table.toString());
                next();
            })
        })
    }

    deleteJurusan(id_jurusan, next) {
        let sql = `DELETE FROM jurusan WHERE id_jurusan = ?`;
        db.run(sql, id_jurusan, (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log(`jurusan dengan id_jurusan: ${id_jurusan} telah dihapus`);
            next();
        });
    }
};

// DOSEN
class Dosen {

    viewDosen(next) {
        let sql = `SELECT * FROM dosen`;
        this.table = new Table({
            head: ['id_dosen', 'nama'],
            colWidths: [10, 20]
        });
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error(err);
            }
            for (let i = 0; i < rows.length; i++) {
                this.table.push([rows[i].id_dosen, rows[i].nama]);
            }
            console.log(this.table.toString());
            next();
        })
    }

    searchDosen(id_dosen, next) {
        let sql = `SELECT * FROM dosen WHERE id_dosen = ?`;
        db.get(sql, [id_dosen], (err, row) => {
            if (err)
                throw err;
            if (row) {
                printLine();
                console.log('Detail Dosen: ');
                printLine();
                console.log(`id_dosen        : ${id_dosen}`);
                console.log(`Nama            : ${row.nama}`);
            } else {
                console.log(`Dosen dengan id_dosen ${id_dosen} tidak terdaftar`);
            }
            next();
        })
    }

    addDosen(id_dosen, nama, next) {
        let sql = `INSERT INTO dosen(id_dosen,nama) VALUES (?,?)`;
        let sql2 = `SELECT * FROM dosen`;
        db.run(sql, [id_dosen, nama], (err) => {
            if (err) {
                console.error(err.message);
            }
            this.table = new Table({
                head: ['id_dosen', 'nama'],
                colWidths: [10, 20]
            });
            db.all(sql2, [], (err, rows) => {
                if (err) {
                    console.error(err);
                }
                for (let i = 0; i < rows.length; i++) {
                    this.table.push([rows[i].id_dosen, rows[i].nama]);
                }
                console.log(this.table.toString());
                next();
            })
        })
    }

    deleteDosen(id_dosen, next) {
        let sql = `DELETE FROM dosen WHERE id_dosen = ?`;
        db.run(sql, id_dosen, (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log(`Dosen dengan id_dosen: ${id_dosen} telah dihapus`);
            next();
        });
    }
};


// MATAKULIAH
class Matakuliah {

    viewMatakuliah(next) {
        let sql = `SELECT * FROM matakuliah`;
        this.table = new Table({
            head: ['id_matakuliah', 'nama', 'sks'],
            colWidths: [15, 35, 5]
        });
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error(err);
            }
            for (let i = 0; i < rows.length; i++) {
                this.table.push([rows[i].id_matakuliah, rows[i].nama, rows[i].sks]);
            }
            console.log(this.table.toString());
            next();
        })
    }

    searchMatakuliah(id_matakuliah, next) {
        let sql = `SELECT * FROM matakuliah WHERE id_matakuliah = ?`;
        db.get(sql, [id_matakuliah], (err, row) => {
            if (err)
                throw err;
            if (row) {
                printLine();
                console.log('Detail matakuliah: ');
                printLine();
                console.log(`id_matakuliah   : ${id_matakuliah}`);
                console.log(`Nama            : ${row.nama}`);
                console.log(`sks             : ${row.sks}`);
            } else {
                console.log(`matkuliah dengan id_matakuliah ${id_matakuliah} tidak terdaftar`);
            }
            next();
        })
    }

    addMatakuliah(id_matakuliah, nama, sks, next) {
        let sql = `INSERT INTO matakuliah(id_matakuliah,nama,sks) VALUES (?,?,?)`;
        let sql2 = `SELECT * FROM matakuliah`;
        db.run(sql, [id_matakuliah, nama, sks], (err) => {
            if (err) {
                console.error(err.message);
            }
            this.table = new Table({
                head: ['id_matakuliah', 'nama', 'sks'],
                colWidths: [15, 35, 5]
            });
            db.all(sql2, [], (err, rows) => {
                if (err) {
                    console.error(err);
                }
                for (let i = 0; i < rows.length; i++) {
                    this.table.push([rows[i].id_matakuliah, rows[i].nama, rows[i].sks]);
                }
                console.log(this.table.toString());
                next();
            })
        })
    }

    deleteMatakuliah(id_matakuliah, next) {
        let sql = `DELETE FROM matakuliah WHERE id_matakuliah = ?`;
        db.run(sql, id_matakuliah, (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log(`Matakuliah dengan id_matakuliah: ${id_matakuliah} telah dihapus`);
            next();
        });
    }
};


// KONTRAK
class Kontrak {

    viewKontrak(next) {
        let sql = `SELECT * FROM kontrak`;
        this.table = new Table({
            head: ['id', 'nim', 'id_dosen', 'id_matakuliah', 'nilai'],
            colWidths: [5, 10, 10, 20, 10]
        });
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error(err);
            }
            for (let i = 0; i < rows.length; i++) {
                this.table.push([rows[i].id, rows[i].nim, rows[i].id_dosen, rows[i].id_matakuliah, rows[i].nilai]);
            }
            console.log(this.table.toString());
            next();
        })
    }

    searchKontrak(id, next) {
        let sql = `SELECT * FROM kontrak WHERE id = ?`;
        db.get(sql, [id], (err, row) => {
            if (err)
                throw err;
            if (row) {
                printLine();
                console.log('student detail');
                printLine();
                console.log(`ID             : ${id}`);
                console.log(`Nim            : ${row.nim}`);
                console.log(`id_dosen       : ${row.id_dosen}`);
                console.log(`id_matakuliah  : ${row.id_matakuliah}`);
                console.log(`nilai          : ${row.nilai}`);
            } else {
                console.log(`Kontrak dengan id ${id} tidak terdaftar`);
            }
            next();
        })
    }

    addKontrak(id, nim, id_dosen, id_matakuliah, nilai, next) {
        let sql = `INSERT INTO kontrak(id,nim,id_dosen,id_matakuliah,nilai) VALUES (?,?,?,?,?)`;
        let sql2 = `SELECT * FROM kontrak`;
        db.run(sql, [id, nim, id_dosen, id_matakuliah, nilai], (err) => {
            if (err) {
                console.error(err.message);
            }
            this.table = new Table({
                head: ['id', 'nim', 'id_dosen', 'id_matakuliah', 'nilai'],
                colWidths: [5, 10, 10, 20, 10]
            });
            db.all(sql2, [], (err, rows) => {
                if (err) {
                    console.error(err);
                }
                for (let i = 0; i < rows.length; i++) {
                    this.table.push([rows[i].id, rows[i].nim, rows[i].id_dosen, rows[i].id_matakuliah, rows[i].nilai]);
                }
                console.log(this.table.toString());
                next();
            })
        })
    }

    deleteKontrak(id, next) {
        let sql = `DELETE FROM kontrak WHERE id = ?`;
        db.run(sql, id, (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log(`Kontrak dengan id: ${id} telah dihapus`);
            next();
        });
    }
}

//MAIN MENU
function mainMenu() {
    printLine();
    console.log("silahkan pilih opsi di bawah ini");
    console.log("[1] Mahasiswa");
    console.log("[2] Jurusan");
    console.log("[3] Dosen");
    console.log("[4] Mata Kuliah");
    console.log("[5] Kontrak")
    console.log("[6] Keluar");
    printLine();
    rl.question('masukkan salah satu no. dari opsi di atas: ', (answer) => {
        switch (answer) {
            case '1':
                function menuMahasiswa() {
                    printLine();
                    console.log("silahkan pilih opsi di bawah ini")
                    console.log("[1] Daftar Mahasiswa");
                    console.log("[2] Cari Mahasiswa");
                    console.log("[3] Tambah Mahasiswa");
                    console.log("[4] Hapus Mahasiswa");
                    console.log("[5] Kembali");
                    printLine();
                    rl.question('masukkan salah satu no. dari opsi di atas: ', (answer) => {
                        let mahasiswa = new Mahasiswa();
                        switch (answer) {
                            case '1':
                                printLine();
                                mahasiswa.viewMahasiswa(() => {
                                    menuMahasiswa();
                                });
                                break;
                            case '2':
                                printLine();
                                rl.question('Masukkan NIM: ', (answer) => {
                                    let nimMahasiswa = answer;
                                    mahasiswa.searchMahasiswa(nimMahasiswa, () => {
                                        menuMahasiswa();
                                    });
                                });
                                break;
                            case '3':
                                printLine();
                                console.log("Lengkapi data di bawah ini:");
                                rl.question('NIM: ', (answer1) => {
                                    let nimMahasiswa = answer1;
                                    rl.question('nama: ', (answer2) => {
                                        let namaMahasiswa = answer2;
                                        rl.question('alamat: ', (answer3) => {
                                            let alamatMahasiswa = answer3;
                                            rl.question('jurusan: ', (answer4) => {
                                                let jurusanMahasiswa = answer4;
                                                printLine();
                                                mahasiswa.addMahasiswa(nimMahasiswa, namaMahasiswa, alamatMahasiswa, jurusanMahasiswa, () => {
                                                    menuMahasiswa();
                                                });

                                            })
                                        })
                                    })
                                });
                                break;
                            case '4':
                                printLine();
                                rl.question('Masukkan NIM mahasiswa yang akan dihapus: ', (answer) => {
                                    let nimMahasiswa = answer;
                                    mahasiswa.deleteMahasiswa(nimMahasiswa, () => {
                                        menuMahasiswa();
                                    });
                                });
                                break;
                            default:
                                mainMenu();
                                break;
                        }
                    });

                }
                menuMahasiswa();
                break;
            case '2':
                function menuJurusan() {
                    printLine();
                    console.log("silahkan pilih opsi di bawah ini")
                    console.log("[1] Daftar Jurusan");
                    console.log("[2] Cari Jurusan");
                    console.log("[3] Tambah Jurusan");
                    console.log("[4] Hapus Jurusan");
                    console.log("[5] Kembali");
                    printLine();
                    rl.question('silahkan masukkan no. dari opsi diatas: ', (answer) => {
                        let jurusan = new Jurusan();
                        switch (answer) {
                            case '1':
                                printLine();
                                jurusan.viewJurusan(() => {
                                    menuJurusan();
                                });
                                break;
                            case '2':
                                printLine();
                                rl.question('Masukkan id_jurusan: ', (answer) => {
                                    let id_jurusan = answer;
                                    jurusan.searchJurusan(id_jurusan, () => {
                                        menuJurusan();
                                    });
                                });
                                break;
                            case '3':
                                printLine();
                                console.log("Lengkapi data di bawah ini:");
                                rl.question('id_jurusan: ', (answer1) => {
                                    let id_jurusan = answer1;
                                    rl.question('nama_jurusan: ', (answer2) => {
                                        let nama_jurusan = answer2;
                                        printLine();
                                        jurusan.addJurusan(id_jurusan, nama_jurusan, () => {
                                            menuJurusan();
                                        });
                                    })
                                });
                                break;
                            case '4':
                                printLine();
                                rl.question('Masukkan id jurusan yang akan dihapus:', (answer) => {
                                    let id_jurusan = answer;
                                    jurusan.deleteJurusan(id_jurusan, () => {
                                        menuJurusan();
                                    });
                                });
                                break;
                            default:
                                mainMenu();
                                break;
                        }
                    });
                };
                menuJurusan();
                break;
            case '3':
                function menuDosen() {
                    printLine();
                    console.log("silahkan pilih opsi di bawah ini")
                    console.log("[1] Daftar Dosen");
                    console.log("[2] Cari Dosen");
                    console.log("[3] Tambah Dosen");
                    console.log("[4] Hapus Dosen");
                    console.log("[5] Kembali");
                    printLine();
                    rl.question('silahkan masukkan no. dari opsi diatas: ', (answer) => {
                        let dosen = new Dosen();
                        switch (answer) {
                            case '1':
                                printLine();
                                dosen.viewDosen(() => {
                                    menuDosen();
                                });
                                break;
                            case '2':
                                printLine();
                                rl.question('Masukkan id_dosen: ', (answer) => {
                                    let id_dosen = answer;
                                    dosen.searchDosen(id_dosen, () => {
                                        menuDosen();
                                    });
                                });
                                break;
                            case '3':
                                printLine();
                                console.log("Lengkapi data di bawah ini:");
                                rl.question('id_dosen: ', (answer1) => {
                                    let id_dosen = answer1;
                                    rl.question('nama: ', (answer2) => {
                                        let nama = answer2;
                                        printLine();
                                        dosen.addDosen(id_dosen, nama, () => {
                                            menuDosen();
                                        });
                                    })
                                });
                                break;
                            case '4':
                                printLine();
                                rl.question('Masukkan id dosen yang akan dihapus: ', (answer) => {
                                    let id_dosen = answer;
                                    dosen.deleteDosen(id_dosen, () => {
                                        menuDosen();
                                    });
                                });
                                break;
                            default:
                                mainMenu();
                                break;
                        }
                    });
                };
                menuDosen();
                break;
            case '4':
                function menuMatakuliah() {
                    printLine();
                    console.log("silahkan pilih opsi di bawah ini")
                    console.log("[1] Daftar Matakuliah");
                    console.log("[2] Cari Matakuliah");
                    console.log("[3] Tambah Matakuliah");
                    console.log("[4] Hapus Matakuliah");
                    console.log("[5] Kembali");
                    printLine();
                    rl.question('silahkan masukkan no. dari opsi diatas: ', (answer) => {
                        let matakuliah = new Matakuliah();
                        switch (answer) {
                            case '1':
                                printLine();
                                matakuliah.viewMatakuliah(() => {
                                    menuMatakuliah();
                                });
                                break;
                            case '2':
                                printLine();
                                rl.question('Masukkan id_matakuliah: ', (answer) => {
                                    let id_matakuliah = answer;
                                    matakuliah.searchMatakuliah(id_matakuliah, () => {
                                        menuMatakuliah();
                                    });
                                });
                                break;
                            case '3':
                                printLine();
                                console.log('Lengkapi data di bawah ini: ');
                                rl.question('id_matakuliah: ', (answer1) => {
                                    let id_matakuliah = answer1;
                                    rl.question('nama: ', (answer2) => {
                                        let nama = answer2;
                                        rl.question('sks: ', (answer3) => {
                                            let sks = answer3;
                                            printLine();
                                            matakuliah.addMatakuliah(id_matakuliah, nama, sks, () => {
                                                menuMatakuliah();
                                            });
                                        });
                                    })
                                });
                                break;
                            case '4':
                                printLine();
                                rl.question('Masukkan id matakuliah yang akan dihapus: ', (answer) => {
                                    let id_matakuliah = answer;
                                    matakuliah.deleteMatakuliah(id_matakuliah, () => {
                                        menuMatakuliah();
                                    });
                                });
                                break;
                            default:
                                mainMenu();
                                break;
                        }
                    });
                };
                menuMatakuliah();
                break;
            case '5':
                function menuKontrak() {
                    printLine();
                    console.log("silahkan pilih opsi di bawah ini")
                    console.log("[1] Daftar Kontrak");
                    console.log("[2] Cari Kontrak");
                    console.log("[3] Tambah Kontrak");
                    console.log("[4] Hapus Kontrak");
                    console.log("[5] Kembali");
                    printLine();
                    rl.question('masukkan salah satu no. dari opsi di atas: ', (answer) => {
                        let kontrak = new Kontrak();
                        switch (answer) {
                            case '1':
                                printLine();
                                kontrak.viewKontrak(() => {
                                    menuKontrak();
                                });
                                break;
                            case '2':
                                printLine();
                                rl.question('Masukkan id: ', (answer) => {
                                    let id = answer;
                                    kontrak.searchKontrak(id, () => {
                                        menuKontrak();
                                    });
                                });
                                break;
                            case '3':
                                printLine();
                                console.log("Lengkapi data di bawah ini:");
                                rl.question('id: ', (answer1) => {
                                    let idKontrak = answer1;
                                    rl.question('nim: ', (answer2) => {
                                        let nimKontrak = answer2;
                                        rl.question('id_dosen: ', (answer3) => {
                                            let idDosen = answer3;
                                            rl.question('id_matakuliah: ', (answer4) => {
                                                let idMatakuliah = answer4;
                                                rl.question('nilai: ', (answer5) => {
                                                    let nilaiKontrak = answer5;
                                                    printLine();
                                                    kontrak.addKontrak(idKontrak, nimKontrak, idDosen, idMatakuliah, nilaiKontrak, () => {
                                                        menuKontrak();
                                                    });
                                                });
                                            })
                                        })
                                    })
                                });
                                break;
                            case '4':
                                printLine();
                                rl.question('Masukkan id kontrak yang akan dihapus: ', (answer) => {
                                    let idKontrak = answer;
                                    kontrak.deleteKontrak(idKontrak, () => {
                                        menuKontrak();
                                    });
                                });
                                break;
                            default:
                                mainMenu();
                                break;
                        }
                    });

                }
                menuKontrak();
                break;
            default:
                printLine();
                console.log("kamu telah keluar.");
                login();
                break;
        }
    });
};
