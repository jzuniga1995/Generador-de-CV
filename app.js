document.getElementById('generatePdf').addEventListener('click', function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Recoger los datos del formulario
    const nombre = document.getElementById('nombre').value;
    const titulo = document.getElementById('titulo').value;
    const telefono = document.getElementById('telefono').value;
    const correo = document.getElementById('correo').value;
    const experiencia = document.getElementById('experiencia').value.split(';');
    const educacion = document.getElementById('educacion').value.split(';');
    const habilidades = document.getElementById('habilidades').value.split(',');
    const qrLink = document.getElementById('qrcode-link').value;
    const idioma = document.getElementById('idioma').value;
    const plantilla = document.getElementById('plantilla').value;

    // Definir etiquetas traducidas
    const labels = {
        'es': { 
            cv: 'Curriculum Vitae', 
            nombre: 'Nombre', 
            titulo: 'Título', 
            telefono: 'Teléfono', 
            correo: 'Correo', 
            experiencia: 'Experiencia Laboral', 
            educacion: 'Educación', 
            habilidades: 'Habilidades'
        },
        'en': { 
            cv: 'Curriculum Vitae', 
            nombre: 'Name', 
            titulo: 'Title', 
            telefono: 'Phone', 
            correo: 'Email', 
            experiencia: 'Work Experience', 
            educacion: 'Education', 
            habilidades: 'Skills'
        }
    };

    // Establecer los colores de las plantillas
    if (plantilla === 'moderno') {
        doc.setTextColor(0, 102, 204); // Azul
    } else if (plantilla === 'minimalista') {
        doc.setTextColor(50, 50, 50); // Gris
    } else {
        doc.setTextColor(0, 102, 0); // Verde Clásico
    }

    // Añadir foto si existe
    const fotoInput = document.getElementById('foto').files[0];
    if (fotoInput) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imgData = e.target.result;
            doc.addImage(imgData, 'JPEG', 150, 30, 40, 40); // Añadir imagen
        };
        reader.readAsDataURL(fotoInput);
    }

    // Título del CV
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.text(labels[idioma].cv, 105, 20, null, null, 'center');

    // Datos personales
    doc.setFontSize(16);
    doc.text(`${labels[idioma].nombre}: ${nombre}`, 20, 50);
    doc.text(`${labels[idioma].titulo}: ${titulo}`, 20, 65);
    doc.text(`${labels[idioma].telefono}: ${telefono}`, 20, 80);
    doc.text(`${labels[idioma].correo}: ${correo}`, 20, 95);

    // Sección de experiencia laboral
    doc.setFontSize(14);
    doc.setFont('Helvetica', 'bold');
    doc.text(`${labels[idioma].experiencia}:`, 20, 120);
    doc.setFont('Helvetica', 'normal');
    experiencia.forEach((trabajo, index) => {
        doc.text(`- ${trabajo.trim()}`, 30, 130 + index * 10);
    });

    // Sección de educación
    doc.setFont('Helvetica', 'bold');
    doc.text(`${labels[idioma].educacion}:`, 20, 140 + experiencia.length * 10);
    doc.setFont('Helvetica', 'normal');
    educacion.forEach((edu, index) => {
        doc.text(`- ${edu.trim()}`, 30, 150 + experiencia.length * 10 + index * 10);
    });

    // Sección de habilidades
    doc.setFont('Helvetica', 'bold');
    doc.text(`${labels[idioma].habilidades}:`, 20, 160 + experiencia.length * 10 + educacion.length * 10);
    doc.setFont('Helvetica', 'normal');
    habilidades.forEach((habilidad, index) => {
        doc.text(`- ${habilidad.trim()}`, 30, 170 + experiencia.length * 10 + educacion.length * 10 + index * 10);
    });

    // Generar QR si existe enlace
    if (qrLink) {
        const qrcode = new QRCode(document.getElementById("qrcode"), {
            text: qrLink,
            width: 128,
            height: 128
        });

        setTimeout(function () {
            const qrCanvas = document.querySelector('#qrcode canvas');
            const qrImage = qrCanvas.toDataURL('image/png');
            doc.addImage(qrImage, 'PNG', 150, 120, 40, 40); // Ajustar la posición del QR

            // Añadir leyenda debajo del QR
            doc.setFontSize(10);
            doc.text("Escanear para más información", 150, 165);
        }, 500);
    }

    // Fecha automática de creación del CV
    const today = new Date();
    const formattedDate = today.toLocaleDateString(idioma === 'es' ? 'es-ES' : 'en-US');
    doc.setFontSize(10);
    doc.text(`Generado el: ${formattedDate}`, 20, 280); // Pie de página con la fecha

    // Descargar el PDF después de un breve retraso
    setTimeout(function () {
        doc.save(`${nombre}-CV.pdf`);
    }, 1000); // 1 segundo de retraso
});
