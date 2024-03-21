import tkinter as tk
from tkinter import ttk
import numpy as np
import matplotlib.pyplot as plt
import re

def solve_equation():
    try:
        x0 = float(entry_x0.get())
        y0 = float(entry_y0.get())
        h = float(entry_h.get())
        x_end = float(entry_x_end.get())
    except ValueError:
        tk.messagebox.showerror("Error", "Los valores de entrada deben ser números válidos.")
        return
    
    equation = entry_equation.get()
    
    if not equation:
        tk.messagebox.showerror("Error", "Por favor, ingrese una ecuación diferencial.")
        return

    # Parsear la ecuación diferencial
    match = re.match(r'dy/dx\s*=\s*(.*)', equation)
    if match:
        expression = match.group(1)
        try:
            # Definición de la ecuación diferencial dy/dx = f(x, y)
            def f(x, y):
                return eval(expression, {"x": x, "y": y, "np": np, "sin": np.sin, "cos": np.cos, "tan": np.tan, "exp": np.exp, "sqrt": np.sqrt})
        except:
            tk.messagebox.showerror("Error", "La ecuación diferencial ingresada no es válida.")
            return
    else:
        tk.messagebox.showerror("Error", "Formato de ecuación incorrecto. Por favor, ingrese la ecuación en el formato 'dy/dx = f(x, y)'.")
        return

    def euler_method(f, x0, y0, h, x_end):
        n_steps = int((x_end - x0) / h) + 1
        x_values = np.linspace(x0, x_end, n_steps)
        y_values = np.zeros_like(x_values)
        y_values[0] = y0

        for i in range(1, n_steps):
            y_values[i] = y_values[i-1] + f(x_values[i-1], y_values[i-1]) * h

        return x_values, y_values

    # Resolver la ecuación diferencial usando el método de Euler
    x_values, y_values = euler_method(f, x0, y0, h, x_end)

    # Graficar la solución
    plt.figure(figsize=(8, 6))
    plt.plot(x_values, y_values, label='Solución de Euler', color='purple')  # Configurar el color a morado
    plt.title('Solución de Ecuación Diferencial {} usando Método de Euler'.format(equation))
    plt.xlabel('x')
    plt.ylabel('y')
    plt.legend()
    plt.grid(True)
    plt.show()

# Crear la interfaz gráfica
root = tk.Tk()
root.title("Calculadora de Ecuaciones Diferenciales")

# Ajustar tamaño de la ventana
root.geometry("550x250")

frame = ttk.Frame(root, padding="10")
frame.grid(column=0, row=0, sticky=(tk.W, tk.E, tk.N, tk.S))

label_description = ttk.Label(frame, text="Esta App permite resolver ecuaciones diferenciales de primer orden utilizando el método de Euler.")
label_description.grid(column=0, row=0, columnspan=2, sticky=tk.W)

label_equation = ttk.Label(frame, text="Ecuación diferencial (dy/dx = f(x, y)):")
label_equation.grid(column=0, row=1, sticky=tk.W)
entry_equation = ttk.Entry(frame)
entry_equation.grid(column=1, row=1)

label_x0 = ttk.Label(frame, text="x0:")
label_x0.grid(column=0, row=2, sticky=tk.W)
entry_x0 = ttk.Entry(frame)
entry_x0.grid(column=1, row=2)

label_y0 = ttk.Label(frame, text="y0:")
label_y0.grid(column=0, row=3, sticky=tk.W)
entry_y0 = ttk.Entry(frame)
entry_y0.grid(column=1, row=3)

label_h = ttk.Label(frame, text="Tamaño del paso:")
label_h.grid(column=0, row=4, sticky=tk.W)
entry_h = ttk.Entry(frame)
entry_h.grid(column=1, row=4)

label_x_end = ttk.Label(frame, text="x End:")
label_x_end.grid(column=0, row=5, sticky=tk.W)
entry_x_end = ttk.Entry(frame)
entry_x_end.grid(column=1, row=5)

button_solve = ttk.Button(frame, text="Resolver", command=solve_equation)
button_solve.grid(column=0, row=6, columnspan=2)

root.mainloop()
