//
// Copyright 2017 Christian Reitwiessner
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
// 2019 OKIMS
//      ported to solidity 0.6
//      fixed linter warnings
//      added requiere error messages
//
// 2021 Remco Bloemen
//       cleaned up code
//       added InvalidProve() error
//       always revert with InvalidProof() on invalid proof
//       make Pairing strict
//
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

library Pairing {
  error InvalidProof();

  // The prime q in the base field F_q for G1
  uint256 constant BASE_MODULUS = 21888242871839275222246405745257275088696311157297823662689037894645226208583;

  // The prime moludus of the scalar field of G1.
  uint256 constant SCALAR_MODULUS = 21888242871839275222246405745257275088548364400416034343698204186575808495617;

  struct G1Point {
    uint256 X;
    uint256 Y;
  }

  // Encoding of field elements is: X[0] * z + X[1]
  struct G2Point {
    uint256[2] X;
    uint256[2] Y;
  }

  /// @return the generator of G1
  function P1() internal pure returns (G1Point memory) {
    return G1Point(1, 2);
  }

  /// @return the generator of G2
  function P2() internal pure returns (G2Point memory) {
    return
      G2Point(
        [
          11559732032986387107991004021392285783925812861821192530917403151452391805634,
          10857046999023057135944570762232829481370756359578518086990519993285655852781
        ],
        [
          4082367875863433681332203403145435568316851327593401208105741076214120093531,
          8495653923123431417604973247489272438418190587263600148770280649306958101930
        ]
      );
  }

  /// @return r the negation of p, i.e. p.addition(p.negate()) should be zero.
  function negate(G1Point memory p) internal pure returns (G1Point memory r) {
    if (p.X == 0 && p.Y == 0) return G1Point(0, 0);
    // Validate input or revert
    if (p.X >= BASE_MODULUS || p.Y >= BASE_MODULUS) revert InvalidProof();
    // We know p.Y > 0 and p.Y < BASE_MODULUS.
    return G1Point(p.X, BASE_MODULUS - p.Y);
  }

  /// @return r the sum of two points of G1
  function addition(G1Point memory p1, G1Point memory p2) internal view returns (G1Point memory r) {
    // By EIP-196 all input is validated to be less than the BASE_MODULUS and form points
    // on the curve.
    uint256[4] memory input;
    input[0] = p1.X;
    input[1] = p1.Y;
    input[2] = p2.X;
    input[3] = p2.Y;
    bool success;
    // solium-disable-next-line security/no-inline-assembly
    assembly {
      success := staticcall(sub(gas(), 2000), 6, input, 0xc0, r, 0x60)
    }
    if (!success) revert InvalidProof();
  }

  /// @return r the product of a point on G1 and a scalar, i.e.
  /// p == p.scalar_mul(1) and p.addition(p) == p.scalar_mul(2) for all points p.
  function scalar_mul(G1Point memory p, uint256 s) internal view returns (G1Point memory r) {
    // By EIP-196 the values p.X and p.Y are verified to less than the BASE_MODULUS and
    // form a valid point on the curve. But the scalar is not verified, so we do that explicitelly.
    if (s >= SCALAR_MODULUS) revert InvalidProof();
    uint256[3] memory input;
    input[0] = p.X;
    input[1] = p.Y;
    input[2] = s;
    bool success;
    // solium-disable-next-line security/no-inline-assembly
    assembly {
      success := staticcall(sub(gas(), 2000), 7, input, 0x80, r, 0x60)
    }
    if (!success) revert InvalidProof();
  }

  /// Asserts the pairing check
  /// e(p1[0], p2[0]) *  .... * e(p1[n], p2[n]) == 1
  /// For example pairing([P1(), P1().negate()], [P2(), P2()]) should succeed
  function pairingCheck(G1Point[] memory p1, G2Point[] memory p2) internal view {
    // By EIP-197 all input is verified to be less than the BASE_MODULUS and form elements in their
    // respective groups of the right order.
    if (p1.length != p2.length) revert InvalidProof();
    uint256 elements = p1.length;
    uint256 inputSize = elements * 6;
    uint256[] memory input = new uint256[](inputSize);
    for (uint256 i = 0; i < elements; i++) {
      input[i * 6 + 0] = p1[i].X;
      input[i * 6 + 1] = p1[i].Y;
      input[i * 6 + 2] = p2[i].X[0];
      input[i * 6 + 3] = p2[i].X[1];
      input[i * 6 + 4] = p2[i].Y[0];
      input[i * 6 + 5] = p2[i].Y[1];
    }
    uint256[1] memory out;
    bool success;
    // solium-disable-next-line security/no-inline-assembly
    assembly {
      success := staticcall(sub(gas(), 2000), 8, add(input, 0x20), mul(inputSize, 0x20), out, 0x20)
    }
    if (!success || out[0] != 1) revert InvalidProof();
  }
}

contract Verifier23 {
  using Pairing for *;

  struct VerifyingKey {
    Pairing.G1Point alfa1;
    Pairing.G2Point beta2;
    Pairing.G2Point gamma2;
    Pairing.G2Point delta2;
    Pairing.G1Point[] IC;
  }

  struct Proof {
    Pairing.G1Point A;
    Pairing.G2Point B;
    Pairing.G1Point C;
  }

  function verifyingKey() internal pure returns (VerifyingKey memory vk) {
    vk.alfa1 = Pairing.G1Point(
      20491192805390485299153009773594534940189261866228447918068658471970481763042,
      9383485363053290200918347156157836566562967994039712273449902621266178545958
    );

    vk.beta2 = Pairing.G2Point(
      [4252822878758300859123897981450591353533073413197771768651442665752259397132, 6375614351688725206403948262868962793625744043794305715222011528459656738731],
      [21847035105528745403288232691147584728191162732299865338377159692350059136679, 10505242626370262277552901082094356697409835680220590971873171140371331206856]
    );

    vk.gamma2 = Pairing.G2Point(
      [11559732032986387107991004021392285783925812861821192530917403151452391805634, 10857046999023057135944570762232829481370756359578518086990519993285655852781],
      [4082367875863433681332203403145435568316851327593401208105741076214120093531, 8495653923123431417604973247489272438418190587263600148770280649306958101930]
    );

    vk.delta2 = Pairing.G2Point(
      [9830856103389248449121962275587399130605902703453384856543071762984116567573, 11408965575174993375815840422438995549652812400401163392501956884932167624437],
      [11814906841949499037550820576929552248172160643991870665022770052632331265834, 19969543376625663966419118899515353499678204573709836615846115182224340858492]
    );

    vk.IC = new Pairing.G1Point[](5);

    
      vk.IC[0] = Pairing.G1Point(
        3047486363455933831148688762823238723024952519326207356549121929667745957778,
        20241836359289449005887237560564358543646542598344362915541027571505243817211
      );
    
      vk.IC[1] = Pairing.G1Point(
        5965631918800530319167124148627450454569264331058008407732200168631989208657,
        20463557477532480934514091877628554948892025887087712764683631108388998871350
      );
    
      vk.IC[2] = Pairing.G1Point(
        16605042322692983282732511249912403956057999815658038166796858627082222971215,
        12219061498275616585164456833410962809536084885494309093787669879221959361956
      );
    
      vk.IC[3] = Pairing.G1Point(
        1548998572074037722622224303222294716243074837074272552644853986075252666508,
        10393312002885367652301897874262367916506364670364584602554176742602334134772
      );
    
      vk.IC[4] = Pairing.G1Point(
        16180907689593358346406392015123900260925622357393826746385511046141256905390,
        12267326749885120640972074479210537480053065569337817484467225562817467244765
      );
    
  }

  /// @dev Verifies a Semaphore proof. Reverts with InvalidProof if the proof is invalid.
  function verifyProof(
    uint[2] memory a,
    uint[2][2] memory b,
    uint[2] memory c,
    uint[4] memory input
  ) public view {
    // If the values are not in the correct range, the Pairing contract will revert.
    Proof memory proof;
    proof.A = Pairing.G1Point(a[0], a[1]);
    proof.B = Pairing.G2Point([b[0][0], b[0][1]], [b[1][0], b[1][1]]);
    proof.C = Pairing.G1Point(c[0], c[1]);

    VerifyingKey memory vk = verifyingKey();

    // Compute the linear combination vk_x of inputs times IC
    if (input.length + 1 != vk.IC.length) revert Pairing.InvalidProof();
    Pairing.G1Point memory vk_x = vk.IC[0];
    vk_x = Pairing.addition(vk_x, Pairing.scalar_mul(vk.IC[1], input[0]));
    vk_x = Pairing.addition(vk_x, Pairing.scalar_mul(vk.IC[2], input[1]));
    vk_x = Pairing.addition(vk_x, Pairing.scalar_mul(vk.IC[3], input[2]));
    vk_x = Pairing.addition(vk_x, Pairing.scalar_mul(vk.IC[4], input[3]));

    // Check pairing
    Pairing.G1Point[] memory p1 = new Pairing.G1Point[](4);
    Pairing.G2Point[] memory p2 = new Pairing.G2Point[](4);
    p1[0] = Pairing.negate(proof.A);
    p2[0] = proof.B;
    p1[1] = vk.alfa1;
    p2[1] = vk.beta2;
    p1[2] = vk_x;
    p2[2] = vk.gamma2;
    p1[3] = proof.C;
    p2[3] = vk.delta2;
    Pairing.pairingCheck(p1, p2);
  }
}
